"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleWishlist = exports.removeAddress = exports.addAddress = exports.updateProfile = exports.getMe = exports.resetPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const authService_1 = __importDefault(require("../services/authService"));
const emailService_1 = __importDefault(require("../services/emailService"));
const User_1 = __importDefault(require("../models/User"));
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = (0, asyncHandler_1.default)(async (req, res, next) => {
    const result = await authService_1.default.registerUser(req.body);
    // Send welcome email (async)
    emailService_1.default.sendWelcomeEmail(result.user).catch(err => console.error('Email error:', err));
    res.status(201).json({
        success: true,
        ...result
    });
});
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new errorResponse_1.default('Please provide email and password', 400));
    }
    const result = await authService_1.default.loginUser(email, password);
    res.status(200).json({
        success: true,
        ...result
    });
});
// @desc    Forgot Password - Send OTP
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { email } = req.body;
    const user = await User_1.default.findOne({ email });
    if (!user) {
        return next(new errorResponse_1.default('User not found', 404));
    }
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    await user.save();
    try {
        await emailService_1.default.sendOTPEmail(user.email, otp);
        res.status(200).json({ success: true, message: 'OTP sent to email' });
    }
    catch (err) {
        user.otp = null;
        user.otpExpire = null;
        await user.save();
        return next(new errorResponse_1.default('Email could not be sent', 500));
    }
});
// @desc    Reset Password
// @route   PUT /api/auth/resetpassword
// @access  Public
exports.resetPassword = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { email, otp, newPassword } = req.body;
    await authService_1.default.resetPasswordService(email, otp, newPassword);
    res.status(200).json({ success: true, message: 'Password reset successful' });
});
// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = (0, asyncHandler_1.default)(async (req, res, next) => {
    if (!req.user) {
        return next(new errorResponse_1.default('Not authorized', 401));
    }
    const user = await User_1.default.findById(req.user.id).populate('wishlist');
    res.status(200).json({ success: true, user });
});
// @desc    Update profile
// @route   PUT /api/auth/updateprofile
// @access  Private
exports.updateProfile = (0, asyncHandler_1.default)(async (req, res, next) => {
    if (!req.user) {
        return next(new errorResponse_1.default('Not authorized', 401));
    }
    const { name, phoneNumber } = req.body;
    const updateData = {};
    if (name)
        updateData.name = name;
    if (phoneNumber)
        updateData.phoneNumber = phoneNumber;
    const user = await User_1.default.findByIdAndUpdate(req.user.id, updateData, {
        new: true,
        runValidators: true
    });
    res.status(200).json({ success: true, user });
});
// @desc    Add address
// @route   POST /api/auth/address
// @access  Private
exports.addAddress = (0, asyncHandler_1.default)(async (req, res, next) => {
    if (!req.user) {
        return next(new errorResponse_1.default('Not authorized', 401));
    }
    const user = await User_1.default.findById(req.user.id);
    if (!user)
        return next(new errorResponse_1.default('User not found', 404));
    // If it's the first address, make it default
    if (user.addresses.length === 0) {
        req.body.isDefault = true;
    }
    user.addresses.push(req.body);
    await user.save();
    res.status(200).json({ success: true, addresses: user.addresses });
});
// @desc    Remove address
// @route   DELETE /api/auth/address/:id
// @access  Private
exports.removeAddress = (0, asyncHandler_1.default)(async (req, res, next) => {
    if (!req.user) {
        return next(new errorResponse_1.default('Not authorized', 401));
    }
    const user = await User_1.default.findById(req.user.id);
    if (!user)
        return next(new errorResponse_1.default('User not found', 404));
    user.addresses = user.addresses.filter((addr) => addr._id.toString() !== req.params.id);
    await user.save();
    res.status(200).json({ success: true, addresses: user.addresses });
});
// @desc    Toggle wishlist item
// @route   POST /api/auth/wishlist/:productId
// @access  Private
exports.toggleWishlist = (0, asyncHandler_1.default)(async (req, res, next) => {
    if (!req.user) {
        return next(new errorResponse_1.default('Not authorized', 401));
    }
    const user = await User_1.default.findById(req.user.id);
    if (!user)
        return next(new errorResponse_1.default('User not found', 404));
    const productId = req.params.productId;
    const wishlistStrings = user.wishlist.map(id => id.toString());
    const index = wishlistStrings.indexOf(productId);
    if (index > -1) {
        user.wishlist.splice(index, 1);
    }
    else {
        user.wishlist.push(productId);
    }
    await user.save();
    res.status(200).json({ success: true, wishlist: user.wishlist });
});
//# sourceMappingURL=authController.js.map