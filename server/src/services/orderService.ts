import Order from '../models/Order';
import Cart from '../models/Cart';
import Coupon from '../models/Coupon';
import * as paymentService from './paymentService';
import * as emailService from './emailService';
import whatsappService from './whatsappService';
import ErrorResponse from '../utils/errorResponse';
import advancedResults from '../utils/advancedResults';

/**
 * Service to handle Order business logic
 */
class OrderService {
    
    /**
     * Create a new order from user's cart
     */
    async createOrder(user: any, orderData: any) {
        const userId = user.id;
        const { shippingAddress, paymentMethod, couponCode } = orderData;

        // Fetch user's cart with product details
        const cart: any = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            throw new ErrorResponse('No items in cart', 400);
        }

        // Validate and map cart items to order items
        const orderItems = [];
        let totalAmount = 0;

        for (const item of cart.items) {
            if (!item.product) {
                throw new ErrorResponse('Cart contains invalid/deleted products', 400);
            }

            // Calculate discounted price if applicable based on bulk purchase discounts
            const basePrice = item.product.price;
            const quantity = item.quantity;
            
            // Find highest applicable discount tier
            const applicableDiscount = (item.product.quantityDiscounts || [])
                .filter((d: any) => quantity >= d.minQuantity)
                .sort((a: any, b: any) => b.minQuantity - a.minQuantity)[0];
                
            const discountRate = applicableDiscount ? applicableDiscount.discountPercentage : 0;
            const discountedPrice = basePrice * (1 - discountRate / 100);

            const itemTotal = quantity * discountedPrice;
            totalAmount += itemTotal;

            orderItems.push({
                product: item.product._id,
                name: item.product.name,
                quantity: item.quantity,
                price: discountedPrice, // Use the discounted price for the order records
                selectedSize: item.selectedSize,
                selectedShape: item.selectedShape,
                selectedMaterial: item.selectedMaterial || item.selectedFinish,
                selectedFinish: item.selectedFinish || item.selectedMaterial,
                image: item.product.images?.[0]
            });
        }

        // Apply Coupon if provided
        let discount = 0;
        if (couponCode) {
            const coupon: any = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
            if (!coupon) {
                throw new ErrorResponse('Invalid coupon code', 400);
            }
            if (new Date() > coupon.expiresAt) {
                throw new ErrorResponse('Coupon has expired', 400);
            }
            if (totalAmount < coupon.minPurchase) {
                throw new ErrorResponse(`Minimum purchase of INR ${coupon.minPurchase} required for this coupon`, 400);
            }

            if (coupon.discountType === 'percentage') {
                discount = (totalAmount * coupon.discountValue) / 100;
            } else {
                discount = coupon.discountValue;
            }

            totalAmount = Math.max(0, totalAmount - discount);
            
            // Increment coupon usage
            coupon.usedCount += 1;
            await coupon.save();
        }

        let razorpayOrder = null;
        if (paymentMethod === 'Razorpay') {
            razorpayOrder = await (paymentService as any).createRazorpayOrder(totalAmount, `receipt_${Date.now()}`);
        }

        // Create the order
        const order = await Order.create({
            user: userId,
            items: orderItems,
            shippingAddress,
            paymentInfo: {
                method: paymentMethod || 'COD',
                status: paymentMethod === 'Razorpay' ? 'Pending' : 'Processing',
                razorpayOrderId: razorpayOrder ? razorpayOrder.id : undefined,
                id: razorpayOrder ? razorpayOrder.id : undefined
            },
            orderStatus: paymentMethod === 'Razorpay' ? 'Pending' : 'Processing',
            totalAmount,
            coupon: couponCode ? { code: couponCode, discount } : undefined
        });

        if (order) {
            // Clear the cart
            cart.items = [];
            await cart.save();

            // Send confirmation email ONLY if it's not a pending online payment
            if (order.paymentInfo.status !== 'Pending') {
                emailService.sendOrderConfirmationEmail(user, order).catch((err: any) => console.error('Order Confirmation Email error:', err));
                whatsappService.sendOrderConfirmation(user, order).catch((err: any) => console.error('Order Confirmation WhatsApp error:', err));
            }
        }

        return {
            order,
            razorpayOrder
        };
    }

    /**
     * Get orders for a specific user
     */
    async getUserOrders(userId: string) {
        return await Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .lean();
    }

    /**
     * Get a single order by ID
     */
    async getOrderById(orderId: string, user: any) {
        const order: any = await Order.findById(orderId).populate('user', 'name email');

        if (!order) {
            throw new ErrorResponse('Order not found', 404);
        }

        // Authorization check: User must own the order or be an admin
        const isOwner = order.user._id.toString() === user.id;
        const isAdmin = user.role === 'admin' || user.role === 'super-admin';

        if (!isOwner && !isAdmin) {
            throw new ErrorResponse('Not authorized to view this order', 401);
        }

        return order;
    }

    /**
     * Get all orders with pagination/filtering (Admin only)
     */
    async getAllOrders(reqQuery: any) {
        return await advancedResults(Order as any, reqQuery, {
            path: 'user',
            select: 'name email'
        });
    }

    /**
     * Cancel an order (User only if pending/processing)
     */
    async cancelOrder(orderId: string, userId: string) {
        const order: any = await Order.findOne({ _id: orderId, user: userId });

        if (!order) {
            throw new ErrorResponse('Order not found', 404);
        }

        if (order.orderStatus !== 'Pending' && order.orderStatus !== 'Processing') {
            throw new ErrorResponse(`Cannot cancel order. Current status: ${order.orderStatus}`, 400);
        }

        order.orderStatus = 'Cancelled';
        await order.save();

        // Send notifications (async)
        const populatedOrder = await Order.findById(order._id).populate('user');
        if (populatedOrder && populatedOrder.user) {
            emailService.sendOrderStatusEmail(populatedOrder.user, populatedOrder).catch(err => console.error('Email status update error:', err));
            whatsappService.sendOrderStatusUpdate(populatedOrder.user, populatedOrder).catch(err => console.error('WhatsApp status update error:', err));
        }

        return order;
    }

    /**
     * Update order status and tracking info
     */
    async updateOrderStatus(orderId: string, updateData: any) {
        const order: any = await Order.findById(orderId);

        if (!order) {
            throw new ErrorResponse('Order not found', 404);
        }

        const { status, trackingNumber, courierName, trackingUrl } = updateData;

        if (status) {
            // Restriction: Admin cannot change status if payment is Pending
            if (order.paymentInfo.status === 'Pending' && order.paymentInfo.method === 'Razorpay') {
                throw new ErrorResponse('Cannot update order status while payment is Pending.', 400);
            }

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

        // Send notifications (async)
        const populatedOrder = await Order.findById(order._id).populate('user');
        if (populatedOrder && populatedOrder.user) {
            emailService.sendOrderStatusEmail(populatedOrder.user, populatedOrder).catch(err => console.error('Email status update error:', err));
            whatsappService.sendOrderStatusUpdate(populatedOrder.user, populatedOrder).catch(err => console.error('WhatsApp status update error:', err));
        }

        return order;
    }
}

export default new OrderService();
