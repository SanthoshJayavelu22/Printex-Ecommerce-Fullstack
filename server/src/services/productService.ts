import path from 'path';
import Product, { IProduct } from '../models/Product';
import Category from '../models/Category';
import ErrorResponse from '../utils/errorResponse';
import advancedResults from '../utils/advancedResults';
import { createSlug } from '../utils/slugify';

// Helper to sanitize file path for database (always save as public/uploads/...)
const normalizePath = (filePath: string) => {
    // Convert all backslashes to forward slashes
    const normalized = filePath.replace(/\\/g, '/');
    // If it's an absolute path, find the 'public' part and keep it from there
    const publicIndex = normalized.indexOf('public/');
    if (publicIndex !== -1) {
        return normalized.substring(publicIndex);
    }
    return normalized;
};

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
    } else {
        productData.relatedProducts = [];
    }

    // Helper to ensure field is a clean array
    const ensureArray = (field: string, data: any) => {
        let val = data[field];
        if (!val) return [];
        
        // If it's a string, try JSON parse (for FormData strings like "[]")
        if (typeof val === 'string') {
            try {
                const parsed = JSON.parse(val);
                return Array.isArray(parsed) ? parsed : [parsed];
            } catch (e) {
                return [val];
            }
        }
        
        // If it's an array, handle cases like ["[]"] (sometimes happens with multipart parser)
        if (Array.isArray(val)) {
            if (val.length === 1 && typeof val[0] === 'string' && val[0].trim().startsWith('[')) {
                try {
                    const parsed = JSON.parse(val[0]);
                    return Array.isArray(parsed) ? parsed : [parsed];
                } catch (e) {}
            }
            return val;
        }
        
        return [val];
    };

    ['quantityDiscounts', 'availableShapes', 'availableSizes', 'availableMaterials', 'availableQuantities'].forEach(field => {
        productData[field] = ensureArray(field, productData);
    });

    // Ensure availableQuantities is array of numbers
    if (Array.isArray(productData.availableQuantities)) {
        productData.availableQuantities = productData.availableQuantities.map(n => Number(n)).filter(n => !isNaN(n));
    }

    // Clean up technical defaults (convert empty strings to null/proper types)
    if (productData.defaultQuantity === '') productData.defaultQuantity = null;
    if (productData.defaultShape === '') productData.defaultShape = '';
    if (productData.defaultSize === '') productData.defaultSize = '';
    if (productData.defaultMaterial === '') productData.defaultMaterial = '';

    let images: string[] = [];
    if (files && (files.mainImage || files.additionalImages)) {
        if (files.mainImage && files.mainImage[0]) {
            images.push(normalizePath(files.mainImage[0].path));
        }
        if (files.additionalImages && Array.isArray(files.additionalImages)) {
            files.additionalImages.forEach((file: any) => images.push(normalizePath(file.path)));
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
    
    // Helper to ensure field is a clean array
    const ensureArray = (field: string, data: any) => {
        let val = data[field];
        if (!val) return [];
        
        if (typeof val === 'string') {
            try {
                const parsed = JSON.parse(val);
                return Array.isArray(parsed) ? parsed : [parsed];
            } catch (e) {
                return [val];
            }
        }
        
        if (Array.isArray(val)) {
            if (val.length === 1 && typeof val[0] === 'string' && val[0].trim().startsWith('[')) {
                try {
                    const parsed = JSON.parse(val[0]);
                    return Array.isArray(parsed) ? parsed : [parsed];
                } catch (e) {}
            }
            return val;
        }
        
        return [val];
    };

    ['quantityDiscounts', 'availableShapes', 'availableSizes', 'availableMaterials', 'availableQuantities'].forEach(field => {
        updateData[field] = ensureArray(field, updateData);
    });

    // Ensure availableQuantities is array of numbers
    if (Array.isArray(updateData.availableQuantities)) {
        updateData.availableQuantities = updateData.availableQuantities.map(n => Number(n)).filter(n => !isNaN(n));
    }

    // Clean up technical defaults (convert empty strings to null/proper types)
    if (updateData.defaultQuantity === '') updateData.defaultQuantity = null;
    if (updateData.defaultShape === '') updateData.defaultShape = '';
    if (updateData.defaultSize === '') updateData.defaultSize = '';
    if (updateData.defaultMaterial === '') updateData.defaultMaterial = '';

    // Handle image updates if provided in files or existingImages
    let mergedImages: string[] = [];

    // existingImages might be an array or string (from FormData)
    if (updateData.existingImages) {
        if (typeof updateData.existingImages === 'string') {
            // Check if it's not an empty string or "[]"
            if (updateData.existingImages.trim() !== '' && updateData.existingImages !== '[]') {
                try {
                    const parsed = JSON.parse(updateData.existingImages);
                    if (Array.isArray(parsed)) {
                        mergedImages = parsed;
                    } else {
                        mergedImages.push(updateData.existingImages);
                    }
                } catch (e) {
                    mergedImages.push(updateData.existingImages);
                }
            }
        } else if (Array.isArray(updateData.existingImages)) {
            mergedImages = [...updateData.existingImages];
        }
    }

    const hasNewFiles = files && (files.mainImage || files.additionalImages);
    if (hasNewFiles) {
        if (files.mainImage && files.mainImage[0]) {
            mergedImages.unshift(normalizePath(files.mainImage[0].path));
        }
        if (files.additionalImages && Array.isArray(files.additionalImages)) {
             files.additionalImages.forEach((file: any) => mergedImages.push(normalizePath(file.path)));
        }
    }
    
    // Always update images array if editing and we have a definitive set of images or new files
    if (hasNewFiles || updateData.existingImages !== undefined) {
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
