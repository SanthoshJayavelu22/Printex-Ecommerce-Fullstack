import cartService from '../services/cartService';
import asyncHandler from '../middleware/asyncHandler';

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(async (req, res, next) => {
    const cart = await cartService.getCart(req.user.id);
    res.status(200).json({
        success: true,
        data: cart
    });
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addItem = asyncHandler(async (req, res, next) => {
    const itemData = { ...req.body };
    if (req.file) {
        itemData.designUrl = req.file.path;
        itemData.needsDesign = false;
    } else if (req.body.needsDesign === 'true' || req.body.needsDesign === true) {
        itemData.needsDesign = true;
    }

    const cart = await cartService.addToCart(req.user.id, itemData);
    res.status(200).json({
        success: true,
        data: cart
    });
});

// @desc    Update cart item
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateItem = asyncHandler(async (req, res, next) => {
    const cart = await cartService.updateCartItem(req.user.id, req.params.itemId, req.body);
    res.status(200).json({
        success: true,
        data: cart
    });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeItem = asyncHandler(async (req, res, next) => {
    const cart = await cartService.removeFromCart(req.user.id, req.params.itemId);
    res.status(200).json({
        success: true,
        data: cart
    });
});

// @desc    Remove multiple items from cart
// @route   POST /api/cart/remove
// @access  Private
export const removeItems = asyncHandler(async (req, res, next) => {
    const { itemIds } = req.body;
    const cart = await cartService.removeMultipleFromCart(req.user.id, itemIds);
    res.status(200).json({
        success: true,
        data: cart
    });
});
