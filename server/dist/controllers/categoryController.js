"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategory = exports.getCategoryTree = exports.getCategories = void 0;
const Category_1 = __importDefault(require("../models/Category"));
const Product_1 = __importDefault(require("../models/Product"));
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
const activityController_1 = require("./activityController");
// Helper to create slug
const createSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};
// Helper to build tree
const buildCategoryTree = (categories, parentId = null) => {
    const categoryList = [];
    let parentFiltered;
    if (parentId == null) {
        parentFiltered = categories.filter(cat => cat.parent == null);
    }
    else {
        parentFiltered = categories.filter(cat => cat.parent && cat.parent.toString() === parentId.toString());
    }
    for (let cat of parentFiltered) {
        // Find children
        const children = buildCategoryTree(categories, cat._id);
        const catObj = cat.toObject ? cat.toObject() : cat;
        if (children.length > 0) {
            catObj.children = children;
        }
        else {
            catObj.children = [];
        }
        categoryList.push(catObj);
    }
    // Sort by order
    return categoryList.sort((a, b) => a.order - b.order);
};
// @desc    Get all categories (flat array)
// @route   GET /api/categories
// @access  Public
exports.getCategories = (0, asyncHandler_1.default)(async (req, res, next) => {
    const categories = await Category_1.default.find().sort({ order: 1 }).lean();
    res.status(200).json({
        success: true,
        count: categories.length,
        data: categories
    });
});
// @desc    Get complete category tree with products populated for mega menu
// @route   GET /api/categories/tree
// @access  Public
exports.getCategoryTree = (0, asyncHandler_1.default)(async (req, res, next) => {
    const filter = req.query.includeInactive === 'true' ? {} : { isActive: true };
    const categories = await Category_1.default.find(filter).sort({ order: 1 }).lean();
    const tree = buildCategoryTree(categories);
    // Recursive helper to populate products for each category node
    const populateProducts = async (nodes) => {
        for (let node of nodes) {
            // Only show active products in the Mega Menu (filter out disabled ones)
            node.products = await Product_1.default.find({ categories: node._id, isActive: true })
                .select('name slug isActive')
                .sort('name')
                .lean();
            if (node.children && node.children.length > 0) {
                await populateProducts(node.children);
            }
        }
    };
    await populateProducts(tree);
    res.status(200).json({
        success: true,
        data: tree
    });
});
// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = (0, asyncHandler_1.default)(async (req, res, next) => {
    const category = await Category_1.default.findById(req.params.id).lean();
    if (!category) {
        return next(new errorResponse_1.default(`Category not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        data: category
    });
});
// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = (0, asyncHandler_1.default)(async (req, res, next) => {
    let { name, slug, parent, image, icon, isActive, order } = req.body;
    if (!slug) {
        slug = createSlug(name);
    }
    // Prevent duplicate slug
    const existing = await Category_1.default.findOne({ slug });
    if (existing) {
        return next(new errorResponse_1.default('Category with this slug already exists', 400));
    }
    const parsedParent = parent || null;
    // Shift orders if creating at a specific order
    if (order !== undefined) {
        await Category_1.default.updateMany({ parent: parsedParent, order: { $gte: order } }, { $inc: { order: 1 } });
    }
    const category = await Category_1.default.create({
        name, slug, parent: parsedParent, image, icon, isActive, order
    });
    await (0, activityController_1.logActivity)(req.user.id, 'CREATE', 'CATEGORY', `Category created: ${category.name}`, req);
    res.status(201).json({
        success: true,
        data: category
    });
});
// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = (0, asyncHandler_1.default)(async (req, res, next) => {
    let category = await Category_1.default.findById(req.params.id);
    if (!category) {
        return next(new errorResponse_1.default(`Category not found with id of ${req.params.id}`, 404));
    }
    // if name changed, check slug
    let newSlug = req.body.slug;
    if (!newSlug && req.body.name) {
        newSlug = createSlug(req.body.name);
    }
    else if (!newSlug && !req.body.name) {
        newSlug = category.slug;
    }
    if (newSlug && newSlug !== category.slug) {
        const existing = await Category_1.default.findOne({ slug: newSlug });
        if (existing && existing._id.toString() !== category._id.toString()) {
            return next(new errorResponse_1.default('Category with this slug already exists', 400));
        }
        req.body.slug = newSlug;
    }
    else if (newSlug) {
        req.body.slug = newSlug;
    }
    // Optional: prevent changing parent to self
    if (req.body.parent === req.params.id) {
        return next(new errorResponse_1.default('A category cannot be its own parent', 400));
    }
    // Convert empty string or undefined parent to null
    if (req.body.parent === '')
        req.body.parent = null;
    // Handle order shifting
    if (req.body.order !== undefined && req.body.order !== category.order) {
        const newOrder = req.body.order;
        const oldOrder = category.order;
        const parentId = req.body.parent !== undefined ? req.body.parent : category.parent;
        if (newOrder > oldOrder) {
            await Category_1.default.updateMany({ parent: parentId, order: { $gt: oldOrder, $lte: newOrder } }, { $inc: { order: -1 } });
        }
        else {
            await Category_1.default.updateMany({ parent: parentId, order: { $gte: newOrder, $lt: oldOrder } }, { $inc: { order: 1 } });
        }
    }
    category = await Category_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    await (0, activityController_1.logActivity)(req.user.id, 'UPDATE', 'CATEGORY', `Category updated: ${category.name}`, req);
    res.status(200).json({
        success: true,
        data: category
    });
});
// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = (0, asyncHandler_1.default)(async (req, res, next) => {
    const category = await Category_1.default.findById(req.params.id);
    if (!category) {
        return next(new errorResponse_1.default(`Category not found with id of ${req.params.id}`, 404));
    }
    // Prevent delete if it has children
    const children = await Category_1.default.countDocuments({ parent: req.params.id });
    if (children > 0) {
        return next(new errorResponse_1.default('Cannot delete category with sub-categories. Remove them first.', 400));
    }
    // Prevent delete if products are attached
    const products = await Product_1.default.countDocuments({ categories: req.params.id });
    if (products > 0) {
        return next(new errorResponse_1.default('Cannot delete category because it has products attached.', 400));
    }
    await Category_1.default.findByIdAndDelete(req.params.id);
    await (0, activityController_1.logActivity)(req.user.id, 'DELETE', 'CATEGORY', `Category ID deleted: ${req.params.id}`, req);
    res.status(200).json({
        success: true,
        message: 'Category deleted successfully'
    });
});
//# sourceMappingURL=categoryController.js.map