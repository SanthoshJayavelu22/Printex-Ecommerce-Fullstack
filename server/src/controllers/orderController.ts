import orderService from '../services/orderService';
import asyncHandler from '../middleware/asyncHandler';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res, next) => {
    const data = await orderService.createOrder(req.user, req.body);
    
    res.status(201).json({
        success: true,
        data
    });
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res, next) => {
    const orders = await orderService.getUserOrders(req.user.id);

    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
    });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res, next) => {
    const order = await orderService.getOrderById(req.params.id as string, req.user);

    res.status(200).json({
        success: true,
        data: order
    });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res, next) => {
    const orders = await orderService.getAllOrders(req.query);

    res.status(200).json(orders);
});

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req, res, next) => {
    const order = await orderService.cancelOrder(req.params.id as string, req.user.id as string);

    res.status(200).json({
        success: true,
        data: order
    });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res, next) => {
    const order = await orderService.updateOrderStatus(req.params.id as string, req.body);

    res.status(200).json({
        success: true,
        data: order
    });
});
