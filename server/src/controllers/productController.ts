import productService from '../services/productService';
import asyncHandler from '../middleware/asyncHandler';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res, next) => {
    const results = await productService.getAllProducts(req.query);
    res.status(200).json(results);
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req, res, next) => {
    const product = await productService.getProductById(req.params.id as string);
    res.status(200).json({
        success: true,
        data: product
    });
});

// @desc    Get single product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
export const getProductBySlug = asyncHandler(async (req, res, next) => {
    const product = await productService.getProductBySlug(req.params.slug as string);
    res.status(200).json({
        success: true,
        data: product
    });
});

// @desc    Get products by category slug
// @route   GET /api/products/category/:slug
// @access  Public
export const getProductsByCategory = asyncHandler(async (req, res, next) => {
    const results = await productService.getProductsByCategorySlug(req.params.slug as string, req.query);
    res.status(200).json(results);
});

// @desc    Add new product
// @route   POST /api/products
// @access  Private/Admin
export const addProduct = asyncHandler(async (req, res, next) => {
    const product = await productService.createProduct(req.body, req.files, req.user.id);

    res.status(201).json({
        success: true,
        data: product
    });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res, next) => {
    const product = await productService.updateProduct(req.params.id as string, req.body, req.files);

    res.status(200).json({
        success: true,
        data: product
    });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res, next) => {
    await productService.deleteProduct(req.params.id as string);

    res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
    });
});
