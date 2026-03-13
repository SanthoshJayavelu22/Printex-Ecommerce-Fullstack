"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLowStockProducts = exports.getStats = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const User_1 = __importDefault(require("../models/User"));
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { range, start, end } = req.query;
    let dateFilter = {};
    if (range && range !== 'all_time') {
        let startDate = new Date();
        let endDate = new Date();
        if (range === 'this_week') {
            const day = startDate.getDay();
            const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
            startDate.setDate(diff);
            startDate.setHours(0, 0, 0, 0);
        }
        else if (range === 'last_week') {
            const day = startDate.getDay();
            const diff = startDate.getDate() - day + (day === 0 ? -6 : 1) - 7;
            startDate.setDate(diff);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            endDate.setHours(23, 59, 59, 999);
        }
        else if (range === 'this_month') {
            startDate.setDate(1);
            startDate.setHours(0, 0, 0, 0);
        }
        else if (range === 'last_month') {
            startDate.setMonth(startDate.getMonth() - 1);
            startDate.setDate(1);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(startDate);
            endDate.setMonth(startDate.getMonth() + 1);
            endDate.setDate(0);
            endDate.setHours(23, 59, 59, 999);
        }
        else if (range === 'custom' && start && end) {
            startDate = new Date(start);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(end);
            endDate.setHours(23, 59, 59, 999);
        }
        else {
            startDate = null; // invalid fallback
        }
        if (startDate) {
            dateFilter.createdAt = { $gte: startDate, $lte: endDate };
        }
    }
    const totalOrders = await Order_1.default.countDocuments(dateFilter);
    const totalProducts = await Product_1.default.countDocuments();
    const totalUsers = await User_1.default.countDocuments({ role: 'user', ...dateFilter });
    // Use aggregation for revenue for better performance
    const revenueStats = await Order_1.default.aggregate([
        { $match: { orderStatus: { $ne: 'Cancelled' }, ...dateFilter } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].total : 0;
    const recentOrders = await Order_1.default.find(dateFilter)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(10);
    res.status(200).json({
        success: true,
        data: {
            totalOrders,
            totalProducts,
            totalUsers,
            totalRevenue,
            recentOrders
        }
    });
});
// @desc    Get low stock products
// @route   GET /api/admin/low-stock
// @access  Private/Admin
exports.getLowStockProducts = (0, asyncHandler_1.default)(async (req, res, next) => {
    const products = await Product_1.default.find({
        stock: { $lt: 10 }
    }).select('name stock price');
    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
});
//# sourceMappingURL=adminController.js.map