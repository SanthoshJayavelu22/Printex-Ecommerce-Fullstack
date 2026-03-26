import Razorpay from 'razorpay';
import crypto from 'crypto';
import ErrorResponse from '../utils/errorResponse';
import Order from '../models/Order';
import * as emailService from './emailService';
import User from '../models/User';

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
 * Handle Razorpay Webhook Events
 */
export const handleWebhook = async (req: any) => {
    const signature = req.headers['x-razorpay-signature'];
    const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
    
    // Verify Webhook Signature
    const expectedSignature = crypto
        .createHmac("sha256", WEBHOOK_SECRET!)
        .update(JSON.stringify(req.body))
        .digest("hex");

    if (expectedSignature !== signature) {
        console.error('[WEBHOOK ERROR] Invalid Razorpay webhook signature.');
        return false;
    }

    const event = req.body;
    console.log(`[WEBHOOK] Received Razorpay event: ${event.event}`);

    // Handle payment.failed event
    if (event.event === 'payment.failed') {
        const { payload } = event;
        const razorpay_order_id = payload.payment.entity.order_id;
        
        if (razorpay_order_id) {
            const order = await Order.findOne({ 'paymentInfo.razorpayOrderId': razorpay_order_id });
            if (order && order.paymentInfo.status === 'Pending') {
                order.paymentInfo.status = 'Failed';
                order.orderStatus = 'Rejected';
                await order.save();
                console.log(`[WEBHOOK SUCCESS] Order #${order._id} marked as Failed due to payment.failed event.`);
            }
        }
    }

    return true;
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
    order.orderStatus = 'Processing'; // Set to processing after payment
    await order.save();

    // Send confirmation emails after successful payment
    try {
        const user = await User.findById(order.user);
        if (user) {
            emailService.sendOrderConfirmationEmail(user, order).catch(err => console.error('[PAYMENT] Email error:', err));
        }
    } catch (err) {
        console.error('[PAYMENT] Error finding user for email:', err);
    }

    return order;
};

/**
 * Cleanup function to mark 'Pending' orders as 'Failed' if they are older than 60 minutes
 */
export const markExpiredOrdersAsFailed = async () => {
    try {
        const sixtyMinutesAgo = new Date(Date.now() - 60 * 60 * 1000);
        
        const expiredOrders = await Order.find({
            'paymentInfo.status': 'Pending',
            'orderStatus': 'Pending', // Razorpay orders stay in Pending until paid
            createdAt: { $lt: sixtyMinutesAgo }
        });

        if (expiredOrders.length > 0) {
            console.log(`[CLEANUP] Found ${expiredOrders.length} expired pending orders.`);
            
            for (const order of expiredOrders) {
                order.paymentInfo.status = 'Failed';
                order.orderStatus = 'Rejected';
                await order.save();
                console.log(`[CLEANUP] Order #${order._id} marked as Failed due to 60-min timeout.`);
            }
        }
    } catch (error) {
        console.error('[CLEANUP ERROR] Failed to cleanup expired orders:', error);
    }
};

export default {
    createRazorpayOrder,
    verifySignature,
    verifyAndProcessPayment,
    markExpiredOrdersAsFailed,
    handleWebhook
};
