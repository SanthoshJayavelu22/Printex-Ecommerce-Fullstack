import sendEmail from '../utils/sendEmail';

/**
 * Send welcome email to new users
 */
export const sendWelcomeEmail = async (user: any) => {
    await sendEmail({
        email: user.email,
        subject: 'Welcome to Printex Labels!',
        message: `Hello ${user.name},\n\nThank you for joining Printex Labels. We are excited to have you with us!`,
        html: `<h1>Welcome to Printex Labels!</h1><p>Hello ${user.name},</p><p>Thank you for joining Printex Labels. We are excited to have you with us!</p>`
    });
};

/**
 * Send order confirmation email
 */
export const sendOrderConfirmationEmail = async (user: any, order: any) => {
    await sendEmail({
        email: user.email,
        subject: `Order Confirmation - #${order._id}`,
        message: `Hello ${user.name},\n\nYour order #${order._id} has been placed successfully. Total Amount: INR ${order.totalAmount}`,
        html: `<h1>Order Confirmation</h1><p>Hello ${user.name},</p><p>Your order <strong>#${order._id}</strong> has been placed successfully.</p><p>Total Amount: <strong>INR ${order.totalAmount}</strong></p>`
    });
};

/**
 * Send OTP for password reset or verification
 */
export const sendOTPEmail = async (email: string, otp: string) => {
    await sendEmail({
        email: email,
        subject: 'Your OTP Code',
        message: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
        html: `<h1>OTP Verification</h1><p>Your OTP code is <strong>${otp}</strong>.</p><p>It will expire in 10 minutes.</p>`
    });
};

export default {
    sendWelcomeEmail,
    sendOrderConfirmationEmail,
    sendOTPEmail
};
