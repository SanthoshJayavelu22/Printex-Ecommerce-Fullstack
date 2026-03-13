import wishlistService from '../services/wishlistService';
import asyncHandler from '../middleware/asyncHandler';

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = asyncHandler(async (req, res, next) => {
    const wishlist = await wishlistService.getWishlist(req.user.id);

    res.status(200).json({
        success: true,
        data: wishlist
    });
});

// @desc    Add/Remove product from wishlist (toggle)
// @route   POST /api/wishlist/:productId
// @access  Private
export const toggleWishlist = asyncHandler(async (req, res, next) => {
    const wishlist = await wishlistService.toggleWishlist(req.user.id, req.params.productId);

    res.status(200).json({
        success: true,
        data: wishlist
    });
});
