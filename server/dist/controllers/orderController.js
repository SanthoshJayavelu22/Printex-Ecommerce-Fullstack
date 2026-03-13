"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.cancelOrder = exports.getAllOrders = exports.getOrderById = exports.getMyOrders = exports.createOrder = void 0;
const orderService_1 = __importDefault(require("../services/orderService"));
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const activityController_1 = require("./activityController");
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = (0, asyncHandler_1.default)(async (req, res, next) => {
    const data = await orderService_1.default.createOrder(req.user, req.body);
    res.status(201).json({
        success: true,
        data
    });
});
// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = (0, asyncHandler_1.default)(async (req, res, next) => {
    const orders = await orderService_1.default.getUserOrders(req.user.id);
    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
    });
});
// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = (0, asyncHandler_1.default)(async (req, res, next) => {
    const order = await orderService_1.default.getOrderById(req.params.id, req.user);
    res.status(200).json({
        success: true,
        data: order
    });
});
// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = (0, asyncHandler_1.default)(async (req, res, next) => {
    const orders = await orderService_1.default.getAllOrders(req.query);
    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
    });
});
// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = (0, asyncHandler_1.default)(async (req, res, next) => {
    const order = await orderService_1.default.cancelOrder(req.params.id, req.user.id);
    res.status(200).json({
        success: true,
        data: order
    });
});
// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = (0, asyncHandler_1.default)(async (req, res, next) => {
    const order = await orderService_1.default.updateOrderStatus(req.params.id, req.body);
    await (0, activityController_1.logActivity)(req.user.id, 'UPDATE', 'ORDER', `Order ${order._id} status updated to ${order.orderStatus}`, req);
    res.status(200).json({
        success: true,
        data: order
    });
});
//# sourceMappingURL=orderController.js.map