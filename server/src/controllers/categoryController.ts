import categoryService from '../services/categoryService';
import asyncHandler from '../middleware/asyncHandler';

// @desc    Get all categories (flat array)
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res, next) => {
    const categories = await categoryService.getCategories();
    res.status(200).json({
        success: true,
        count: categories.length,
        data: categories
    });
});

// @desc    Get complete category tree with products populated for mega menu
// @route   GET /api/categories/tree
// @access  Public
export const getCategoryTree = asyncHandler(async (req, res, next) => {
    const includeInactive = req.query.includeInactive === 'true';
    const tree = await categoryService.getCategoryTree(includeInactive);

    res.status(200).json({
        success: true,
        data: tree
    });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategory = asyncHandler(async (req, res, next) => {
    const category = await categoryService.getCategoryById(req.params.id as string);

    res.status(200).json({
        success: true,
        data: category
    });
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res, next) => {
    const category = await categoryService.createCategory(req.body);

    res.status(201).json({
        success: true,
        data: category
    });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(async (req, res, next) => {
    const category = await categoryService.updateCategory(req.params.id as string, req.body);

    res.status(200).json({
        success: true,
        data: category
    });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req, res, next) => {
    await categoryService.deleteCategory(req.params.id as string);

    res.status(200).json({
        success: true,
        message: 'Category deleted successfully'
    });
});
