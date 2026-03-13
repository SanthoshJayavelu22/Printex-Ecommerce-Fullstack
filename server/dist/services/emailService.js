"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTPEmail = exports.sendOrderConfirmationEmail = exports.sendWelcomeEmail = void 0;
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
/**
 * Send welcome email to new users
 */
const sendWelcomeEmail = async (user) => {
    await (0, sendEmail_1.default)({
        email: user.email,
        subject: 'Welcome to Tridev Ecommerce!',
        message: `Hello ${user.name},\n\nThank you for joining Tridev Ecommerce. We are excited to have you with us!`,
        html: `<h1>Welcome to Tridev Ecommerce!</h1><p>Hello ${user.name},</p><p>Thank you for joining Tridev Ecommerce. We are excited to have you with us!</p>`
    });
};
exports.sendWelcomeEmail = sendWelcomeEmail;
/**
 * Send order confirmation email
 */
const sendOrderConfirmationEmail = async (user, order) => {
    await (0, sendEmail_1.default)({
        email: user.email,
        subject: `Order Confirmation - #${order._id}`,
        message: `Hello ${user.name},\n\nYour order #${order._id} has been placed successfully. Total Amount: INR ${order.totalAmount}`,
        html: `<h1>Order Confirmation</h1><p>Hello ${user.name},</p><p>Your order <strong>#${order._id}</strong> has been placed successfully.</p><p>Total Amount: <strong>INR ${order.totalAmount}</strong></p>`
    });
};
exports.sendOrderConfirmationEmail = sendOrderConfirmationEmail;
/**
 * Send OTP for password reset or verification
 */
const sendOTPEmail = async (email, otp) => {
    await (0, sendEmail_1.default)({
        email: email,
        subject: 'Your OTP Code',
        message: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
        html: `<h1>OTP Verification</h1><p>Your OTP code is <strong>${otp}</strong>.</p><p>It will expire in 10 minutes.</p>`
    });
};
exports.sendOTPEmail = sendOTPEmail;
exports.default = {
    sendWelcomeEmail: exports.sendWelcomeEmail,
    sendOrderConfirmationEmail: exports.sendOrderConfirmationEmail,
    sendOTPEmail: exports.sendOTPEmail
};
//# sourceMappingURL=emailService.js.map