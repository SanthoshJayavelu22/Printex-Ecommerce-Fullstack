import { Response, NextFunction } from 'express';
import authService from '../services/authService';
import emailService from '../services/emailService';
import asyncHandler from '../middleware/asyncHandler';
import ErrorResponse from '../utils/errorResponse';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const result = await authService.registerUser(req.body);
    
    res.status(201).json({
        success: true,
        ...result
    });
});

// @desc    Verify OTP for registration
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return next(new ErrorResponse('Please provide email and OTP', 400));
    }

    const result = await authService.verifyRegisterOTP(email, otp);

    res.status(200).json({
        success: true,
        ...result
    });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Please provide email and password', 400));
    }

    const result = await authService.loginUser(email, password);

    res.status(200).json({
        success: true,
        ...result
    });
});

// @desc    Forgot Password - Send OTP
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { email } = req.body;
    await authService.forgotPasswordService(email);

    res.status(200).json({ 
        success: true, 
        message: 'OTP sent to email' 
    });
});

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword
// @access  Public
export const resetPassword = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { email, otp, newPassword } = req.body;

    await authService.resetPasswordService(email, otp, newPassword);

    res.status(200).json({ 
        success: true, 
        message: 'Password reset successful' 
    });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new ErrorResponse('Not authorized', 401));
    }
    const user = await authService.getUserProfile(req.user.id);
    res.status(200).json({ 
        success: true, 
        user 
    });
});

// @desc    Update profile
// @route   PUT /api/auth/updateprofile
// @access  Private
export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new ErrorResponse('Not authorized', 401));
    }
    const user = await authService.updateProfileService(req.user.id, req.body);

    res.status(200).json({ 
        success: true, 
        user 
    });
});

// @desc    Add address
// @route   POST /api/auth/address
// @access  Private
export const addAddress = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new ErrorResponse('Not authorized', 401));
    }
    const addresses = await authService.addAddressService(req.user.id, req.body);

    res.status(200).json({ 
        success: true, 
        addresses 
    });
});

// @desc    Remove address
// @route   DELETE /api/auth/address/:id
// @access  Private
export const removeAddress = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new ErrorResponse('Not authorized', 401));
    }
    const addresses = await authService.removeAddressService(req.user.id, req.params.id as string);

    res.status(200).json({ 
        success: true, 
        addresses 
    });
});

// @desc    Toggle wishlist item
// @route   POST /api/auth/wishlist/:productId
// @access  Private
export const toggleWishlist = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new ErrorResponse('Not authorized', 401));
    }
    const wishlist = await authService.toggleWishlistService(req.user.id, req.params.productId as string);

    res.status(200).json({ 
        success: true, 
        wishlist 
    });
});

// @desc    Delete account
// @route   DELETE /api/auth/profile
// @access  Private
export const deleteProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new ErrorResponse('Not authorized', 401));
    }
    await authService.deleteAccountService(req.user.id);

    res.status(200).json({ 
        success: true, 
        message: 'Account deleted successfully' 
    });
});
