"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = void 0;
const paymentService_1 = __importDefault(require("../services/paymentService"));
const Order_1 = __importDefault(require("../models/Order"));
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
// @desc    Verify Razorpay payment
// @route   POST /api/payment/verify
// @access  Private
exports.verifyPayment = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    const isVerified = paymentService_1.default.verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isVerified) {
        return next(new errorResponse_1.default('Payment verification failed', 400));
    }
    const order = await Order_1.default.findById(orderId);
    if (!order) {
        return next(new errorResponse_1.default('Order not found', 404));
    }
    order.paymentInfo.status = 'Paid';
    order.paymentInfo.id = razorpay_payment_id;
    order.orderStatus = 'Processing';
    await order.save();
    res.status(200).json({
        success: true,
        data: order
    });
});
//# sourceMappingURL=paymentController.js.map