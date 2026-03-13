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
