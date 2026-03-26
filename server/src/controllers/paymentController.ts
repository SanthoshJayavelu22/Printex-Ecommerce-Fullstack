import paymentService from '../services/paymentService';
import asyncHandler from '../middleware/asyncHandler';

// @desc    Verify Razorpay payment
// @route   POST /api/payment/verify
// @access  Private
export const verifyPayment = asyncHandler(async (req, res, next) => {
    const order = await paymentService.verifyAndProcessPayment(req.body);

    res.status(200).json({
        success: true,
        data: order
    });
});

// @desc    Razorpay webhook
// @route   POST /api/payment/razorpay-webhook
// @access  Public (Signature verified)
export const razorpayWebhook = asyncHandler(async (req, res, next) => {
    const success = await paymentService.handleWebhook(req);
    
    // Always return 200 to Razorpay to avoid retries
    res.status(200).json({
        success: success,
        message: success ? 'Webhook processed' : 'Signature verification failed'
    });
});
