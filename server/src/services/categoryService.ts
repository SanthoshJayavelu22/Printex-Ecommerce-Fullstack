import Category, { ICategory } from '../models/Category';
import Product from '../models/Product';
import ErrorResponse from '../utils/errorResponse';
import { createSlug } from '../utils/slugify';

export const getCategories = async () => {
    return await Category.find().sort({ order: 1 }).lean();
};

export const getCategoryTree = async (includeInactive: boolean = false) => {
    const filter = includeInactive ? {} : { isActive: true };
    const categories = await Category.find(filter).sort({ order: 1 }).lean();
    const tree = buildCategoryTree(categories);

    // Recursive helper to populate products for each category node
    const populateProducts = async (nodes: any[]) => {
        for (let node of nodes) {
            node.products = await Product.find({ categories: node._id, isActive: true })
                .select('name slug isActive')
                .sort('name')
                .lean();
            
            if (node.children && node.children.length > 0) {
                await populateProducts(node.children);
            }
        }
    };

    await populateProducts(tree);
    return tree;
};

export const getCategoryById = async (id: string) => {
    const category = await Category.findById(id).lean();
    if (!category) {
        throw new ErrorResponse(`Category not found with id of ${id}`, 404);
    }
    return category;
};

export const createCategory = async (categoryData: any) => {
    let { name, slug, parent, order } = categoryData;

    if (!slug) {
        slug = createSlug(name);
    }

    const existing = await Category.findOne({ slug });
    if (existing) {
        throw new ErrorResponse('Category with this slug already exists', 400);
    }

    const parsedParent = parent || null;
    
    if (order !== undefined) {
        await Category.updateMany(
            { parent: parsedParent, order: { $gte: order } },
            { $inc: { order: 1 } }
        );
    }

    return await Category.create({ ...categoryData, slug, parent: parsedParent });
};

export const updateCategory = async (id: string, updateData: any) => {
    let category = await Category.findById(id);

    if (!category) {
        throw new ErrorResponse(`Category not found with id of ${id}`, 404);
    }

    if (!updateData.slug && updateData.name) {
        updateData.slug = createSlug(updateData.name);
    }

    if (updateData.slug && updateData.slug !== category.slug) {
        const existing = await Category.findOne({ slug: updateData.slug });
        if (existing && existing._id.toString() !== id) {
            throw new ErrorResponse('Category with this slug already exists', 400);
        }
    }

    if (updateData.parent === id) {
        throw new ErrorResponse('A category cannot be its own parent', 400);
    }
    
    if (updateData.parent === '') updateData.parent = null;

    if (updateData.order !== undefined && updateData.order !== category.order) {
        const newOrder = updateData.order;
        const oldOrder = category.order;
        const parentId = updateData.parent !== undefined ? updateData.parent : category.parent;

        if (newOrder > oldOrder) {
            await Category.updateMany(
                { parent: parentId, order: { $gt: oldOrder, $lte: newOrder } },
                { $inc: { order: -1 } }
            );
        } else {
            await Category.updateMany(
                { parent: parentId, order: { $gte: newOrder, $lt: oldOrder } },
                { $inc: { order: 1 } }
            );
        }
    }

    return await Category.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    });
};

export const deleteCategory = async (id: string) => {
    const category = await Category.findById(id);

    if (!category) {
        throw new ErrorResponse(`Category not found with id of ${id}`, 404);
    }

    const children = await Category.countDocuments({ parent: id });
    if (children > 0) {
        throw new ErrorResponse('Cannot delete category with sub-categories. Remove them first.', 400);
    }

    const products = await Product.countDocuments({ categories: id });
    if (products > 0) {
         throw new ErrorResponse('Cannot delete category because it has products attached.', 400);
    }

    await Category.findByIdAndDelete(id);
    return true;
};

// Helper to build tree
const buildCategoryTree = (categories: any[], parentId: any = null) => {
    const categoryList: any[] = [];
    let parentFiltered;
    if (parentId == null) {
        parentFiltered = categories.filter(cat => cat.parent == null);
    } else {
        parentFiltered = categories.filter(cat => cat.parent && cat.parent.toString() === parentId.toString());
    }

    for (let cat of parentFiltered) {
        const children = buildCategoryTree(categories, cat._id);
        const catObj = cat.toObject ? cat.toObject() : cat;
        catObj.children = children.length > 0 ? children : [];
        categoryList.push(catObj);
    }

    return categoryList.sort((a, b) => a.order - b.order);
};

export default {
    getCategories,
    getCategoryTree,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
