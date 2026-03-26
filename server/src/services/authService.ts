import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/errorResponse';
import emailService from './emailService';
import whatsappService from './whatsappService';

// Generate Token
const generateToken = (id: string | any) => {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpire = process.env.JWT_EXPIRE || '30d';
    if (!jwtSecret) throw new Error('JWT_SECRET is not defined');
    
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: jwtExpire as any
    });
};

/**
 * Register a new user
 */
export const registerUser = async (userData: any) => {
    const { name, email, password, role, phoneNumber } = userData;

    // Check if user exists
    let user = await User.findOne({ email });
    
    if (user) {
        if (user.isVerified) {
            throw new ErrorResponse('User already exists', 400);
        }
        // If user exists but not verified, update details and resend OTP
        user.name = name;
        user.password = password;
        user.phoneNumber = phoneNumber;
    } else {
        // Create unverified user
        user = new User({
            name,
            email,
            password,
            phoneNumber,
            role: role || 'user',
            isVerified: false
        });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[AUTH] OTP generated for ${user.email || user.phoneNumber}: ${otp}`);
    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    await user.save();

    try {
        // Send notifications (errors are logged but not fatal)
        emailService.sendOTPEmail(user.email, otp).catch(err => {
            console.error('SMTP Error:', err.message);
        });
        
        whatsappService.sendOTP(user.phoneNumber as string, otp).catch(err => {
            console.error('WhatsApp Error:', err.message);
        });
        
        return {
            message: 'Registration initiated. Please check your email/WhatsApp for OTP.'
        };
    } catch (err) {
        console.error('Notification service error:', err);
        return {
            message: 'User created, but there was an error sending the OTP. Please contact admin.'
        };
    }
};

/**
 * Verify Registration OTP
 */
export const verifyRegisterOTP = async (email: string, otp: string) => {
    const user = await User.findOne({
        email,
        otp,
        otpExpire: { $gt: new Date() }
    });

    if (!user) {
        throw new ErrorResponse('Invalid or expired OTP', 400);
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpire = null;

    await user.save();

    // Send welcome notifications (async)
    emailService.sendWelcomeEmail(user).catch(err => console.error('Email error:', err));
    whatsappService.sendWelcomeMessage(user).catch(err => console.error('WhatsApp welcome error:', err));

    const token = generateToken(user._id);

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

/**
 * Login user
 */
export const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await (user as any).matchPassword(password))) {
        throw new ErrorResponse('Invalid credentials', 401);
    }

    if (!user.isVerified && user.email !== 'admin@printixlabels.com') {
        throw new ErrorResponse('Please verify your email to login', 401);
    }

    const token = generateToken(user._id);

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

/**
 * Forgot Password - Send OTP
 */
export const forgotPasswordService = async (email: string) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new ErrorResponse('User not found', 404);
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[FORGOT_PASSWORD] OTP generated for ${user.email}: ${otp}`);
    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    await user.save();

    try {
        await emailService.sendOTPEmail(user.email, otp);
        return true;
    } catch (err) {
        user.otp = null;
        user.otpExpire = null;
        await user.save();
        throw new ErrorResponse('Email could not be sent', 500);
    }
};

/**
 * Reset Password Logic
 */
export const resetPasswordService = async (email: string, otp: string, newPassword: string) => {
    const user = await User.findOne({
        email,
        otp,
        otpExpire: { $gt: new Date() }
    });

    if (!user) {
        throw new ErrorResponse('Invalid or expired OTP', 400);
    }

    // Set new password
    user.password = newPassword;
    user.otp = null;
    user.otpExpire = null;

    await user.save();

    return true;
};

/**
 * Get User Profile
 */
export const getUserProfile = async (userId: string) => {
    const user = await User.findById(userId).populate('wishlist');
    if (!user) {
        throw new ErrorResponse('User not found', 404);
    }
    return user;
};

/**
 * Update User Profile
 */
export const updateProfileService = async (userId: string, updateData: any) => {
    const { name, phoneNumber } = updateData;
    
    const fieldsToUpdate: any = {};
    if (name) fieldsToUpdate.name = name;
    if (phoneNumber) fieldsToUpdate.phoneNumber = phoneNumber;

    const user = await User.findByIdAndUpdate(userId, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    if (!user) {
        throw new ErrorResponse('User not found', 404);
    }

    return user;
};

/**
 * Add Address
 */
export const addAddressService = async (userId: string, addressData: any) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new ErrorResponse('User not found', 404);
    }
    
    // If it's the first address, make it default
    if (user.addresses.length === 0) {
        addressData.isDefault = true;
    }

    user.addresses.push(addressData);
    await user.save();

    return user.addresses;
};

/**
 * Remove Address
 */
export const removeAddressService = async (userId: string, addressId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new ErrorResponse('User not found', 404);
    }
    
    user.addresses = user.addresses.filter((addr: any) => addr._id.toString() !== addressId);
    await user.save();

    return user.addresses;
};

/**
 * Toggle Wishlist
 */
export const toggleWishlistService = async (userId: string, productId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new ErrorResponse('User not found', 404);
    }

    const wishlistStrings = user.wishlist.map(id => id.toString());
    const index = wishlistStrings.indexOf(productId);

    if (index > -1) {
        user.wishlist.splice(index, 1);
    } else {
        user.wishlist.push(productId as any);
    }

    await user.save();
    return user.wishlist;
};

export default {
    registerUser,
    loginUser,
    verifyRegisterOTP,
    forgotPasswordService,
    resetPasswordService,
    getUserProfile,
    updateProfileService,
    addAddressService,
    removeAddressService,
    toggleWishlistService
};
