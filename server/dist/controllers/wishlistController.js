"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleWishlist = exports.getWishlist = void 0;
const Wishlist_1 = __importDefault(require("../models/Wishlist"));
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = (0, asyncHandler_1.default)(async (req, res, next) => {
    let wishlist = await Wishlist_1.default.findOne({ user: req.user.id }).populate('products');
    if (!wishlist) {
        wishlist = await Wishlist_1.default.create({ user: req.user.id, products: [] });
    }
    res.status(200).json({
        success: true,
        data: wishlist
    });
});
// @desc    Add/Remove product from wishlist (toggle)
// @route   POST /api/wishlist/:productId
// @access  Private
exports.toggleWishlist = (0, asyncHandler_1.default)(async (req, res, next) => {
    let wishlist = await Wishlist_1.default.findOne({ user: req.user.id });
    if (!wishlist) {
        wishlist = await Wishlist_1.default.create({ user: req.user.id, products: [] });
    }
    const productId = req.params.productId;
    const index = wishlist.products.indexOf(productId);
    if (index === -1) {
        // Add
        wishlist.products.push(productId);
    }
    else {
        // Remove
        wishlist.products.splice(index, 1);
    }
    await wishlist.save();
    res.status(200).json({
        success: true,
        data: wishlist
    });
});
//# sourceMappingURL=wishlistController.js.map