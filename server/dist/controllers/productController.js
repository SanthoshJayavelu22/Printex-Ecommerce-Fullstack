"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.addProduct = exports.getProductsByCategory = exports.getProductBySlug = exports.getProduct = exports.getProducts = void 0;
const productService_1 = __importDefault(require("../services/productService"));
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const activityController_1 = require("./activityController");
// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = (0, asyncHandler_1.default)(async (req, res, next) => {
    const results = await productService_1.default.getAllProducts(req.query);
    res.status(200).json(results);
});
// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = (0, asyncHandler_1.default)(async (req, res, next) => {
    const product = await productService_1.default.getProductById(req.params.id);
    res.status(200).json({
        success: true,
        data: product
    });
});
// @desc    Get single product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
exports.getProductBySlug = (0, asyncHandler_1.default)(async (req, res, next) => {
    const product = await productService_1.default.getProductBySlug(req.params.slug);
    res.status(200).json({
        success: true,
        data: product
    });
});
// @desc    Get products by category slug
// @route   GET /api/products/category/:slug
// @access  Public
exports.getProductsByCategory = (0, asyncHandler_1.default)(async (req, res, next) => {
    const results = await productService_1.default.getProductsByCategorySlug(req.params.slug, req.query);
    res.status(200).json(results);
});
// @desc    Add new product
// @route   POST /api/products
// @access  Private/Admin
exports.addProduct = (0, asyncHandler_1.default)(async (req, res, next) => {
    const product = await productService_1.default.createProduct(req.body, req.files, req.user.id);
    await (0, activityController_1.logActivity)(req.user.id, 'CREATE', 'PRODUCT', `Product created: ${product.name}`, req);
    res.status(201).json({
        success: true,
        data: product
    });
});
// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = (0, asyncHandler_1.default)(async (req, res, next) => {
    const product = await productService_1.default.updateProduct(req.params.id, req.body, req.files);
    await (0, activityController_1.logActivity)(req.user.id, 'UPDATE', 'PRODUCT', `Product updated: ${product.name}`, req);
    res.status(200).json({
        success: true,
        data: product
    });
});
// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = (0, asyncHandler_1.default)(async (req, res, next) => {
    await productService_1.default.deleteProduct(req.params.id);
    await (0, activityController_1.logActivity)(req.user.id, 'DELETE', 'PRODUCT', `Product ID deleted: ${req.params.id}`, req);
    res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
    });
});
//# sourceMappingURL=productController.js.map