"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Order_1 = __importDefault(require("../models/Order"));
const Cart_1 = __importDefault(require("../models/Cart"));
const Coupon_1 = __importDefault(require("../models/Coupon"));
const paymentService = __importStar(require("./paymentService"));
const emailService = __importStar(require("./emailService"));
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
/**
 * Service to handle Order business logic
 */
class OrderService {
    /**
     * Create a new order from user's cart
     * @param {Object} user - User object
     * @param {Object} orderData - Shipping and payment details
     * @returns {Object} - Created order
     */
    async createOrder(user, orderData) {
        const userId = user.id;
        const { shippingAddress, paymentMethod, couponCode } = orderData;
        // Fetch user's cart with product details
        const cart = await Cart_1.default.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            throw new errorResponse_1.default('No items in cart', 400);
        }
        // Validate and map cart items to order items
        const orderItems = [];
        let totalAmount = 0;
        for (const item of cart.items) {
            if (!item.product) {
                throw new errorResponse_1.default('Cart contains invalid/deleted products', 400);
            }
            const itemTotal = item.quantity * item.product.price;
            totalAmount += itemTotal;
            orderItems.push({
                product: item.product._id,
                name: item.product.name,
                quantity: item.quantity,
                price: item.product.price,
                selectedSize: item.selectedSize,
                selectedFinish: item.selectedFinish,
                image: item.product.images?.[0]
            });
        }
        // Apply Coupon if provided
        let discount = 0;
        if (couponCode) {
            const coupon = await Coupon_1.default.findOne({ code: couponCode.toUpperCase(), isActive: true });
            if (!coupon) {
                throw new errorResponse_1.default('Invalid coupon code', 400);
            }
            if (new Date() > coupon.expiresAt) {
                throw new errorResponse_1.default('Coupon has expired', 400);
            }
            if (totalAmount < coupon.minPurchase) {
                throw new errorResponse_1.default(`Minimum purchase of INR ${coupon.minPurchase} required for this coupon`, 400);
            }
            if (coupon.discountType === 'percentage') {
                discount = (totalAmount * coupon.discountValue) / 100;
            }
            else {
                discount = coupon.discountValue;
            }
            totalAmount = Math.max(0, totalAmount - discount);
            // Increment coupon usage
            coupon.usedCount += 1;
            await coupon.save();
        }
        let razorpayOrder = null;
        if (paymentMethod === 'Razorpay') {
            razorpayOrder = await paymentService.createRazorpayOrder(totalAmount, `receipt_${Date.now()}`);
        }
        // Create the order
        const order = await Order_1.default.create({
            user: userId,
            items: orderItems,
            shippingAddress,
            paymentInfo: {
                method: paymentMethod || 'COD',
                status: paymentMethod === 'Razorpay' ? 'Pending' : 'Processing',
                id: razorpayOrder ? razorpayOrder.id : null
            },
            totalAmount,
            coupon: couponCode ? { code: couponCode, discount } : undefined
        });
        if (order) {
            // Clear the cart
            cart.items = [];
            await cart.save();
            // Send confirmation email (async)
            emailService.sendOrderConfirmationEmail(user, order).catch((err) => console.error('Email error:', err));
        }
        return {
            order,
            razorpayOrder
        };
    }
    /**
     * Get orders for a specific user
     * @param {String} userId
     * @returns {Array} - List of orders
     */
    async getUserOrders(userId) {
        return await Order_1.default.find({ user: userId })
            .sort({ createdAt: -1 })
            .lean(); // Use lean for performance since we just read
    }
    /**
     * Get a single order by ID
     * @param {String} orderId
     * @param {Object} user - Request user object (for auth check)
     * @returns {Object} - Order details
     */
    async getOrderById(orderId, user) {
        const order = await Order_1.default.findById(orderId).populate('user', 'name email');
        if (!order) {
            throw new errorResponse_1.default('Order not found', 404);
        }
        // Authorization check: User must own the order or be an admin
        const isOwner = order.user._id.toString() === user.id;
        const isAdmin = user.role === 'admin' || user.role === 'super-admin';
        if (!isOwner && !isAdmin) {
            throw new errorResponse_1.default('Not authorized to view this order', 401);
        }
        return order;
    }
    /**
     * Get all orders (Admin only)
     * @param {Object} queryParams - Optional filtering/pagination (future proofing)
     * @returns {Array} - List of all orders
     */
    async getAllOrders(queryParams = {}) {
        return await Order_1.default.find()
            .populate('user', 'id name email')
            .sort({ createdAt: -1 });
    }
    /**
     * Cancel an order (User only if pending/processing)
     * @param {String} orderId
     * @param {String} userId
     * @returns {Object} - Cancelled order
     */
    async cancelOrder(orderId, userId) {
        const order = await Order_1.default.findOne({ _id: orderId, user: userId });
        if (!order) {
            throw new errorResponse_1.default('Order not found', 404);
        }
        if (order.orderStatus !== 'Pending' && order.orderStatus !== 'Processing') {
            throw new errorResponse_1.default(`Cannot cancel order. Current status: ${order.orderStatus}`, 400);
        }
        order.orderStatus = 'Cancelled';
        await order.save();
        return order;
    }
    /**
     * Update order status and tracking info
     * @param {String} orderId
     * @param {Object} updateData - Status and tracking details
     * @returns {Object} - Updated order
     */
    async updateOrderStatus(orderId, updateData) {
        const order = await Order_1.default.findById(orderId);
        if (!order) {
            throw new errorResponse_1.default('Order not found', 404);
        }
        const { status, trackingNumber, courierName, trackingUrl } = updateData;
        if (status) {
            order.orderStatus = status;
            if (status === 'Delivered') {
                order.deliveredAt = new Date();
            }
        }
        if (status === 'Shipped' || trackingNumber) {
            order.deliveryTracking = {
                trackingNumber: trackingNumber || order.deliveryTracking?.trackingNumber,
                courierName: courierName || order.deliveryTracking?.courierName,
                trackingUrl: trackingUrl || order.deliveryTracking?.trackingUrl
            };
        }
        await order.save();
        return order;
    }
}
exports.default = new OrderService();
//# sourceMappingURL=orderService.js.map