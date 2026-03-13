import adminService from '../services/adminService';
import asyncHandler from '../middleware/asyncHandler';

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = asyncHandler(async (req, res, next) => {
    const { range, start, end } = req.query;
    
    const stats = await adminService.getDashboardStats(
        range as string, 
        start as string, 
        end as string
    );

    res.status(200).json({
        success: true,
        data: stats
    });
});

// @desc    Get low stock products
// @route   GET /api/admin/low-stock
// @access  Private/Admin
export const getLowStockProducts = asyncHandler(async (req, res, next) => {
    const products = await adminService.getLowStockProducts();

    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
});
