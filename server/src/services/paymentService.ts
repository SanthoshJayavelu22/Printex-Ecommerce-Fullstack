import Razorpay from 'razorpay';
import crypto from 'crypto';
import ErrorResponse from '../utils/errorResponse';
import Order from '../models/Order';

let razorpay: any;

const getRazorpayInstance = () => {
    if (!razorpay) {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.error('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing from .env');
            return null;
        }
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
    }
    return razorpay;
};

/**
 * Create a Razorpay order
 */
export const createRazorpayOrder = async (amount: number, receipt: string) => {
    const options = {
        amount: Math.round(amount * 100), // amount in paise
        currency: "INR",
        receipt: receipt,
    };

    try {
        const instance = getRazorpayInstance();
        if (!instance) {
            throw new ErrorResponse('Razorpay is not configured. Please add keys to .env', 500);
        }
        const order = await instance.orders.create(options);
        return order;
    } catch (error) {
        console.error('Razorpay Error:', error);
        throw new ErrorResponse('Razorpay Order Creation Failed', 500);
    }
};

/**
 * Verify Razorpay signature
 */
export const verifySignature = (orderId: string, paymentId: string, signature: string) => {
    if (!process.env.RAZORPAY_KEY_SECRET) {
        console.error('RAZORPAY_KEY_SECRET is missing from .env');
        return false;
    }
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    return expectedSignature === signature;
};

/**
 * Verify payment and update order status
 */
export const verifyAndProcessPayment = async (paymentData: any) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = paymentData;

    const isVerified = verifySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    );

    if (!isVerified) {
        // Log the failure but don't just throw, maybe update the order with payment failure status
        if (orderId) {
            const order = await Order.findById(orderId);
            if (order) {
                order.paymentInfo.status = 'Failed';
                order.orderStatus = 'Rejected';
                await order.save();
            }
        }
        throw new ErrorResponse('Payment verification failed. Please contact support.', 400);
    }

    const order = await Order.findById(orderId);
    if (!order) {
        throw new ErrorResponse(`Order #${orderId} not found during payment verification`, 404);
    }

    // Success path
    order.paymentInfo.status = 'Paid';
    order.paymentInfo.id = razorpay_payment_id;
    order.paymentInfo.razorpayPaymentId = razorpay_payment_id;
    order.paymentInfo.razorpaySignature = razorpay_signature;
    order.orderStatus = 'Confirmed'; // Marked as confirmed after payment
    await order.save();

    return order;
};

export default {
    createRazorpayOrder,
    verifySignature,
    verifyAndProcessPayment
};
