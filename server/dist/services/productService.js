"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsByCategorySlug = exports.getProductBySlug = exports.getProductById = exports.getAllProducts = exports.deleteProduct = exports.updateProduct = exports.createProduct = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const Category_1 = __importDefault(require("../models/Category"));
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
const createSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};
const createProduct = async (productData, files, adminId) => {
    if (!productData.slug && productData.name) {
        productData.slug = createSlug(productData.name);
    }
    // Convert categories to array if it is a string
    if (productData.categories && typeof productData.categories === 'string') {
        productData.categories = [productData.categories];
    }
    else if (!productData.categories) {
        productData.categories = [];
    }
    // Convert relatedProducts to array if it is a string
    if (productData.relatedProducts && typeof productData.relatedProducts === 'string') {
        productData.relatedProducts = [productData.relatedProducts];
    }
    else if (!productData.relatedProducts) {
        productData.relatedProducts = [];
    }
    // Clean up technical defaults (convert empty strings to null/proper types)
    if (productData.defaultQuantity === '')
        productData.defaultQuantity = null;
    if (productData.defaultShape === '')
        productData.defaultShape = '';
    if (productData.defaultSize === '')
        productData.defaultSize = '';
    if (productData.defaultMaterial === '')
        productData.defaultMaterial = '';
    let images = [];
    if (files) {
        if (files.mainImage) {
            images.push(files.mainImage[0].path.replace(/\\/g, '/'));
        }
        if (files.additionalImages) {
            files.additionalImages.forEach((file) => images.push(file.path.replace(/\\/g, '/')));
        }
    }
    else if (productData.images && Array.isArray(productData.images)) {
        images = productData.images;
    }
    const product = await Product_1.default.create({
        ...productData,
        images,
        admin: adminId
    });
    return product;
};
exports.createProduct = createProduct;
const updateProduct = async (productId, updateData, files) => {
    let product = await Product_1.default.findById(productId);
    if (!product) {
        throw new errorResponse_1.default(`Product not found with id of ${productId}`, 404);
    }
    if (!updateData.slug && updateData.name) {
        updateData.slug = createSlug(updateData.name);
    }
    if (updateData.categories && typeof updateData.categories === 'string') {
        updateData.categories = [updateData.categories];
    }
    if (updateData.relatedProducts && typeof updateData.relatedProducts === 'string') {
        updateData.relatedProducts = [updateData.relatedProducts];
    }
    // Clean up technical defaults (convert empty strings to null/proper types)
    if (updateData.defaultQuantity === '')
        updateData.defaultQuantity = null;
    if (updateData.defaultShape === '')
        updateData.defaultShape = '';
    if (updateData.defaultSize === '')
        updateData.defaultSize = '';
    if (updateData.defaultMaterial === '')
        updateData.defaultMaterial = '';
    // Handle image updates if provided in files or existingImages
    let mergedImages = [];
    // existingImages might be an array or string
    if (updateData.existingImages && typeof updateData.existingImages === 'string') {
        mergedImages.push(updateData.existingImages);
    }
    else if (Array.isArray(updateData.existingImages)) {
        mergedImages = [...updateData.existingImages];
    }
    if (files && (files.mainImage || files.additionalImages)) {
        if (files.mainImage) {
            mergedImages.unshift(files.mainImage[0].path.replace(/\\/g, '/'));
        }
        if (files.additionalImages) {
            files.additionalImages.forEach((file) => mergedImages.push(file.path.replace(/\\/g, '/')));
        }
    }
    // Always update images array if editing (this handles deletions correctly too)
    if (mergedImages.length > 0 || updateData.existingImages !== undefined || files) {
        updateData.images = mergedImages;
    }
    product = await Product_1.default.findByIdAndUpdate(productId, updateData, {
        new: true,
        runValidators: true
    });
    return product;
};
exports.updateProduct = updateProduct;
const deleteProduct = async (productId) => {
    const product = await Product_1.default.findById(productId);
    if (!product) {
        throw new errorResponse_1.default(`Product not found with id of ${productId}`, 404);
    }
    await Product_1.default.findByIdAndDelete(productId);
    return true;
};
exports.deleteProduct = deleteProduct;
const getAllProducts = async (reqQuery) => {
    let query;
    const reqQueryCopy = { ...reqQuery };
    const removeFields = ['select', 'sort', 'page', 'limit', 'keyword'];
    removeFields.forEach(param => delete reqQueryCopy[param]);
    let queryObj = {};
    if (reqQuery.keyword) {
        queryObj.name = { $regex: reqQuery.keyword, $options: 'i' };
    }
    let queryStr = JSON.stringify(reqQueryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    queryObj = { ...queryObj, ...JSON.parse(queryStr) };
    query = Product_1.default.find(queryObj);
    if (reqQuery.select) {
        const fields = reqQuery.select.split(',').join(' ');
        query = query.select(fields);
    }
    if (reqQuery.sort) {
        const sortBy = reqQuery.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }
    else {
        query = query.sort('-createdAt');
    }
    const page = parseInt(reqQuery.page, 10) || 1;
    const limit = parseInt(reqQuery.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product_1.default.countDocuments(queryObj);
    query = query.skip(startIndex).limit(limit).lean();
    const results = await query.populate({
        path: 'categories',
        select: 'name slug'
    });
    const pagination = {};
    if (endIndex < total) {
        pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
        pagination.prev = { page: page - 1, limit };
    }
    return {
        success: true,
        count: results.length,
        total,
        pagination,
        data: results
    };
};
exports.getAllProducts = getAllProducts;
const getProductById = async (productId) => {
    const product = await Product_1.default.findById(productId)
        .populate('categories', 'name slug')
        .populate('relatedProducts', 'name slug images price');
    if (!product) {
        throw new errorResponse_1.default(`Product not found with id of ${productId}`, 404);
    }
    return product;
};
exports.getProductById = getProductById;
const getProductBySlug = async (slug) => {
    const product = await Product_1.default.findOne({ slug })
        .populate('categories', 'name slug breadcrumbs')
        .populate('relatedProducts', 'name slug images price');
    if (!product) {
        throw new errorResponse_1.default(`Product not found with slug of ${slug}`, 404);
    }
    return product;
};
exports.getProductBySlug = getProductBySlug;
const getProductsByCategorySlug = async (slug, reqQuery) => {
    const category = await Category_1.default.findOne({ slug });
    if (!category) {
        throw new errorResponse_1.default(`Category not found with slug ${slug}`, 404);
    }
    // Get subtree category IDs
    const getAllChildrenIds = async (parentId) => {
        let ids = [parentId];
        const children = await Category_1.default.find({ parent: parentId });
        for (let child of children) {
            const childIds = await getAllChildrenIds(child._id);
            ids = ids.concat(childIds);
        }
        return ids;
    };
    const categoryIds = await getAllChildrenIds(category._id);
    // Merge into reqQuery
    reqQuery.categories = { $in: categoryIds };
    return await (0, exports.getAllProducts)(reqQuery);
};
exports.getProductsByCategorySlug = getProductsByCategorySlug;
exports.default = {
    createProduct: exports.createProduct,
    updateProduct: exports.updateProduct,
    deleteProduct: exports.deleteProduct,
    getAllProducts: exports.getAllProducts,
    getProductById: exports.getProductById,
    getProductBySlug: exports.getProductBySlug,
    getProductsByCategorySlug: exports.getProductsByCategorySlug
};
//# sourceMappingURL=productService.js.map