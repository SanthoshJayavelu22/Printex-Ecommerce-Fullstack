"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeItems = exports.removeItem = exports.updateItem = exports.addItem = exports.getCart = void 0;
const cartService_1 = __importDefault(require("../services/cartService"));
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = (0, asyncHandler_1.default)(async (req, res, next) => {
    const cart = await cartService_1.default.getCart(req.user.id);
    res.status(200).json({
        success: true,
        data: cart
    });
});
// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addItem = (0, asyncHandler_1.default)(async (req, res, next) => {
    const itemData = { ...req.body };
    if (req.file) {
        itemData.designUrl = req.file.path;
        itemData.needsDesign = false;
    }
    else if (req.body.needsDesign === 'true' || req.body.needsDesign === true) {
        itemData.needsDesign = true;
    }
    const cart = await cartService_1.default.addToCart(req.user.id, itemData);
    res.status(200).json({
        success: true,
        data: cart
    });
});
// @desc    Update cart item
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateItem = (0, asyncHandler_1.default)(async (req, res, next) => {
    const cart = await cartService_1.default.updateCartItem(req.user.id, req.params.itemId, req.body);
    res.status(200).json({
        success: true,
        data: cart
    });
});
// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeItem = (0, asyncHandler_1.default)(async (req, res, next) => {
    const cart = await cartService_1.default.removeFromCart(req.user.id, req.params.itemId);
    res.status(200).json({
        success: true,
        data: cart
    });
});
// @desc    Remove multiple items from cart
// @route   POST /api/cart/remove
// @access  Private
exports.removeItems = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { itemIds } = req.body;
    const cart = await cartService_1.default.removeMultipleFromCart(req.user.id, itemIds);
    res.status(200).json({
        success: true,
        data: cart
    });
});
//# sourceMappingURL=cartController.js.map