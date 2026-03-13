"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMultipleFromCart = exports.removeFromCart = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const Cart_1 = __importDefault(require("../models/Cart"));
const Product_1 = __importDefault(require("../models/Product"));
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
/**
 * Get user cart with calculated totals
 * Handles soft-deleted products by marking them as unavailable
 */
const getCart = async (userId) => {
    const cart = await Cart_1.default.findOne({ user: userId }).populate({
        path: 'items.product',
        select: 'name price images stock isDeleted minOrderQuantity'
    });
    if (!cart) {
        return { items: [], bill: 0, totalItems: 0 };
    }
    let bill = 0;
    let totalItems = 0;
    // Process items to handle soft-deleted products and calculate totals
    const processedItems = cart.items.map((item) => {
        // If product is null (hard deleted) or marked as deleted (soft deleted)
        if (!item.product || item.product.isDeleted) {
            return {
                ...item.toObject(),
                product: item.product || null,
                unavailable: true,
                unavailableReason: 'Product is no longer available',
                itemTotal: 0
            };
        }
        const itemTotal = item.quantity * item.product.price;
        bill += itemTotal;
        totalItems += item.quantity;
        return {
            ...item.toObject(),
            itemTotal
        };
    });
    return {
        _id: cart._id,
        user: cart.user,
        items: processedItems,
        bill,
        totalItems,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt
    };
};
exports.getCart = getCart;
/**
 * Add item to cart
 */
const addToCart = async (userId, itemData) => {
    const { productId, quantity, selectedSize, selectedFinish } = itemData;
    if (!quantity || quantity < 1) {
        throw new errorResponse_1.default('Quantity must be at least 1', 400);
    }
    // Check if product exists and is valid
    const product = await Product_1.default.findById(productId).select('stock isDeleted minOrderQuantity price');
    if (!product) {
        throw new errorResponse_1.default('Product not found', 404);
    }
    if (product.isDeleted) {
        throw new errorResponse_1.default('Product is not available', 400);
    }
    // Check minimum order quantity
    if (quantity < product.minOrderQuantity) {
        throw new errorResponse_1.default(`Minimum order quantity is ${product.minOrderQuantity}`, 400);
    }
    // Initial stock check
    if (quantity > product.stock) {
        throw new errorResponse_1.default(`Insufficient stock. Only ${product.stock} available.`, 400);
    }
    let cart = await Cart_1.default.findOne({ user: userId });
    if (!cart) {
        cart = await Cart_1.default.create({
            user: userId,
            items: []
        });
    }
    // Check if item already exists in cart
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId &&
        item.selectedSize === selectedSize &&
        item.selectedFinish === selectedFinish &&
        item.designUrl === itemData.designUrl &&
        item.needsDesign === itemData.needsDesign);
    if (itemIndex > -1) {
        const newQuantity = cart.items[itemIndex].quantity + quantity;
        if (newQuantity > product.stock) {
            throw new errorResponse_1.default(`Cannot add items. Total quantity would exceed stock (${product.stock})`, 400);
        }
        cart.items[itemIndex].quantity = newQuantity;
    }
    else {
        cart.items.push({
            product: productId,
            quantity,
            selectedSize,
            selectedFinish,
            designUrl: itemData.designUrl,
            needsDesign: itemData.needsDesign
        });
    }
    await cart.save();
    return await (0, exports.getCart)(userId);
};
exports.addToCart = addToCart;
/**
 * Update cart item quantity
 */
const updateCartItem = async (userId, itemId, data) => {
    const { quantity } = data;
    const cart = await Cart_1.default.findOne({ user: userId }).populate({
        path: 'items.product',
        select: 'stock minOrderQuantity isDeleted price'
    });
    if (!cart) {
        throw new errorResponse_1.default('Cart not found', 404);
    }
    const item = cart.items.id(itemId);
    if (!item) {
        throw new errorResponse_1.default('Item not found in cart', 404);
    }
    if (quantity < 1) {
        cart.items.pull(itemId);
    }
    else {
        if (item.product) {
            if (item.product.isDeleted) {
                throw new errorResponse_1.default('Cannot update invisible product', 400);
            }
            if (quantity < item.product.minOrderQuantity) {
                throw new errorResponse_1.default(`Minimum order quantity is ${item.product.minOrderQuantity}`, 400);
            }
            if (quantity > item.product.stock) {
                throw new errorResponse_1.default(`Insufficient stock. Only ${item.product.stock} available.`, 400);
            }
        }
        item.quantity = quantity;
    }
    await cart.save();
    return await (0, exports.getCart)(userId);
};
exports.updateCartItem = updateCartItem;
/**
 * Remove item from cart
 */
const removeFromCart = async (userId, itemId) => {
    const cart = await Cart_1.default.findOne({ user: userId });
    if (!cart) {
        throw new errorResponse_1.default('Cart not found', 404);
    }
    cart.items.pull(itemId);
    await cart.save();
    return await (0, exports.getCart)(userId);
};
exports.removeFromCart = removeFromCart;
/**
 * Remove multiple items from cart
 */
const removeMultipleFromCart = async (userId, itemIds) => {
    const cart = await Cart_1.default.findOne({ user: userId });
    if (!cart) {
        throw new errorResponse_1.default('Cart not found', 404);
    }
    if (!Array.isArray(itemIds) || itemIds.length === 0) {
        throw new errorResponse_1.default('Please provide an array of item IDs to remove', 400);
    }
    // Filter out the items to be removed
    cart.items = cart.items.filter((item) => !itemIds.includes(item._id.toString()));
    await cart.save();
    return await (0, exports.getCart)(userId);
};
exports.removeMultipleFromCart = removeMultipleFromCart;
exports.default = {
    getCart: exports.getCart,
    addToCart: exports.addToCart,
    updateCartItem: exports.updateCartItem,
    removeFromCart: exports.removeFromCart,
    removeMultipleFromCart: exports.removeMultipleFromCart
};
//# sourceMappingURL=cartService.js.map