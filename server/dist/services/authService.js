"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordService = exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
// Generate Token
const generateToken = (id) => {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpire = process.env.JWT_EXPIRE || '30d';
    if (!jwtSecret)
        throw new Error('JWT_SECRET is not defined');
    return jsonwebtoken_1.default.sign({ id }, jwtSecret, {
        expiresIn: jwtExpire
    });
};
/**
 * Register a new user
 */
const registerUser = async (userData) => {
    const { name, email, password, role } = userData;
    // Check if user exists
    const userExists = await User_1.default.findOne({ email });
    if (userExists) {
        throw new errorResponse_1.default('User already exists', 400);
    }
    // Create user
    const user = await User_1.default.create({
        name,
        email,
        password,
        role: role || 'user'
    });
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
exports.registerUser = registerUser;
/**
 * Login user
 */
const loginUser = async (email, password) => {
    const user = await User_1.default.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
        throw new errorResponse_1.default('Invalid credentials', 401);
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
exports.loginUser = loginUser;
/**
 * Reset Password Logic
 */
const resetPasswordService = async (email, otp, newPassword) => {
    const user = await User_1.default.findOne({
        email,
        otp,
        otpExpire: { $gt: new Date() }
    });
    if (!user) {
        throw new errorResponse_1.default('Invalid or expired OTP', 400);
    }
    // Set new password
    user.password = newPassword;
    user.otp = null;
    user.otpExpire = null;
    await user.save();
    return true;
};
exports.resetPasswordService = resetPasswordService;
exports.default = {
    registerUser: exports.registerUser,
    loginUser: exports.loginUser,
    resetPasswordService: exports.resetPasswordService
};
//# sourceMappingURL=authService.js.map