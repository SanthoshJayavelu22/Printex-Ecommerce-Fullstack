import Product, { IProduct } from '../models/Product';
import Category from '../models/Category';
import ErrorResponse from '../utils/errorResponse';
import advancedResults from '../utils/advancedResults';
import { createSlug } from '../utils/slugify';

export const createProduct = async (productData: any, files: any, adminId: any) => {
    if (!productData.slug && productData.name) {
        productData.slug = createSlug(productData.name);
    }
    
    // Convert categories to array if it is a string
    if (productData.categories && typeof productData.categories === 'string') {
        productData.categories = [productData.categories];
    } else if (!productData.categories) {
        productData.categories = [];
    }
    
    // Convert relatedProducts to array if it is a string
    if (productData.relatedProducts && typeof productData.relatedProducts === 'string') {
        productData.relatedProducts = [productData.relatedProducts];
    } else if (!productData.relatedProducts) {
        productData.relatedProducts = [];
    }

    // Clean up technical defaults (convert empty strings to null/proper types)
    if (productData.defaultQuantity === '') productData.defaultQuantity = null;
    if (productData.defaultShape === '') productData.defaultShape = '';
    if (productData.defaultSize === '') productData.defaultSize = '';
    if (productData.defaultMaterial === '') productData.defaultMaterial = '';

    let images: string[] = [];
    if (files) {
        if (files.mainImage) {
            images.push(files.mainImage[0].path.replace(/\\/g, '/'));
        }
        if (files.additionalImages) {
            files.additionalImages.forEach((file: any) => images.push(file.path.replace(/\\/g, '/')));
        }
    } else if (productData.images && Array.isArray(productData.images)) {
        images = productData.images;
    }

    const product = await Product.create({
        ...productData,
        images,
        admin: adminId
    });

    return product;
};

export const updateProduct = async (productId: string, updateData: any, files: any) => {
    let product = await Product.findById(productId);

    if (!product) {
        throw new ErrorResponse(`Product not found with id of ${productId}`, 404);
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
    if (updateData.defaultQuantity === '') updateData.defaultQuantity = null;
    if (updateData.defaultShape === '') updateData.defaultShape = '';
    if (updateData.defaultSize === '') updateData.defaultSize = '';
    if (updateData.defaultMaterial === '') updateData.defaultMaterial = '';

    // Handle image updates if provided in files or existingImages
    let mergedImages: string[] = [];

    // existingImages might be an array or string
    if (updateData.existingImages && typeof updateData.existingImages === 'string') {
        mergedImages.push(updateData.existingImages);
    } else if (Array.isArray(updateData.existingImages)) {
        mergedImages = [...updateData.existingImages];
    }

    if (files && (files.mainImage || files.additionalImages)) {
        if (files.mainImage) {
            mergedImages.unshift(files.mainImage[0].path.replace(/\\/g, '/'));
        }
        if (files.additionalImages) {
             files.additionalImages.forEach((file: any) => mergedImages.push(file.path.replace(/\\/g, '/')));
        }
    }
    
    // Always update images array if editing (this handles deletions correctly too)
    if (mergedImages.length > 0 || updateData.existingImages !== undefined || files) {
         updateData.images = mergedImages;
    }

    product = await Product.findByIdAndUpdate(productId, updateData, {
        new: true,
        runValidators: true
    });

    return product;
};

export const deleteProduct = async (productId: string) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw new ErrorResponse(`Product not found with id of ${productId}`, 404);
    }

    await Product.findByIdAndDelete(productId);

    return true;
};

export const getAllProducts = async (reqQuery: any) => {
    return await advancedResults(Product as any, reqQuery, {
        path: 'categories',
        select: 'name slug'
    });
};

export const getProductById = async (productId: string) => {
    const product = await Product.findById(productId)
        .populate('categories', 'name slug')
        .populate('relatedProducts', 'name slug images price');

    if (!product) {
        throw new ErrorResponse(`Product not found with id of ${productId}`, 404);
    }

    return product;
};

export const getProductBySlug = async (slug: string) => {
    const product = await Product.findOne({ slug })
        .populate('categories', 'name slug breadcrumbs')
        .populate('relatedProducts', 'name slug images price');

    if (!product) {
        throw new ErrorResponse(`Product not found with slug of ${slug}`, 404);
    }

    return product;
};

export const getProductsByCategorySlug = async (slug: string, reqQuery: any) => {
    const category: any = await Category.findOne({ slug });
    if (!category) {
        throw new ErrorResponse(`Category not found with slug ${slug}`, 404);
    }

    // Get subtree category IDs
    const getAllChildrenIds = async (parentId: any) => {
        let ids: any[] = [parentId];
        const children = await Category.find({ parent: parentId });
        for (let child of children) {
            const childIds: any[] = await getAllChildrenIds(child._id);
            ids = ids.concat(childIds);
        }
        return ids;
    };

    const categoryIds = await getAllChildrenIds(category._id);

    // Merge into reqQuery
    reqQuery.categories = { $in: categoryIds };
    
    return await getAllProducts(reqQuery);
};

export default {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    getProductBySlug,
    getProductsByCategorySlug
};
