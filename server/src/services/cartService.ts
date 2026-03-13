import Cart  from '../models/Cart';
import Product  from '../models/Product';
import ErrorResponse  from '../utils/errorResponse';
/**
 * Get user cart with calculated totals
 * Handles soft-deleted products by marking them as unavailable
 */
export const getCart = async (userId: string) => {
    const cart: any = await Cart.findOne({ user: userId }).populate({
        path: 'items.product',
        select: 'name price images stock isDeleted minOrderQuantity'
    });

    if (!cart) {
        return { items: [], bill: 0, totalItems: 0 };
    }

    let bill = 0;
    let totalItems = 0;

    // Process items to handle soft-deleted products and calculate totals
    const processedItems = cart.items.map((item: any) => {
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
/**
 * Add item to cart
 */
export const addToCart = async (userId: string, itemData: any) => {
    const { productId, quantity, selectedSize, selectedFinish } = itemData;

    if (!quantity || quantity < 1) {
        throw new ErrorResponse('Quantity must be at least 1', 400);
    }

    // Check if product exists and is valid
    const product: any = await Product.findById(productId).select('stock isDeleted minOrderQuantity price');
    
    if (!product) {
        throw new ErrorResponse('Product not found', 404);
    }

    if (product.isDeleted) {
        throw new ErrorResponse('Product is not available', 400);
    }

    // Check minimum order quantity
    if (quantity < product.minOrderQuantity) {
        throw new ErrorResponse(`Minimum order quantity is ${product.minOrderQuantity}`, 400);
    }

    // Initial stock check
    if (quantity > product.stock) {
        throw new ErrorResponse(`Insufficient stock. Only ${product.stock} available.`, 400);
    }

    let cart: any = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = await Cart.create({
            user: userId,
            items: []
        });
    }
    // Check if item already exists in cart
    const itemIndex = cart.items.findIndex((item: any) => 
        item.product.toString() === productId && 
        item.selectedSize === selectedSize &&
        item.selectedFinish === selectedFinish &&
        item.designUrl === itemData.designUrl &&
        item.needsDesign === itemData.needsDesign
    );

    if (itemIndex > -1) {
        const newQuantity = cart.items[itemIndex].quantity + quantity;
        if (newQuantity > product.stock) {
            throw new ErrorResponse(`Cannot add items. Total quantity would exceed stock (${product.stock})`, 400);
        }
        cart.items[itemIndex].quantity = newQuantity;
    } else {
        cart.items.push({
            product: productId as any,
            quantity,
            selectedSize,
            selectedFinish,
            designUrl: itemData.designUrl,
            needsDesign: itemData.needsDesign
        });
    }
    await cart.save();
    return await getCart(userId);
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (userId: string, itemId: string, data: any) => {
    const { quantity } = data;
    
    const cart: any = await Cart.findOne({ user: userId }).populate({
        path: 'items.product',
        select: 'stock minOrderQuantity isDeleted price'
    });

    if (!cart) {
        throw new ErrorResponse('Cart not found', 404);
    }

    const item = cart.items.id(itemId);
    if (!item) {
        throw new ErrorResponse('Item not found in cart', 404);
    }

    if (quantity < 1) {
         cart.items.pull(itemId);
    } else {
        if (item.product) {
             if (item.product.isDeleted) {
                throw new ErrorResponse('Cannot update invisible product', 400);
             }
             
             if (quantity < item.product.minOrderQuantity) {
                 throw new ErrorResponse(`Minimum order quantity is ${item.product.minOrderQuantity}`, 400);
             }

             if (quantity > item.product.stock) {
                 throw new ErrorResponse(`Insufficient stock. Only ${item.product.stock} available.`, 400);
             }
        }
        item.quantity = quantity;
    }
    await cart.save();
    return await getCart(userId);
};
/**
 * Remove item from cart
 */
export const removeFromCart = async (userId: string, itemId: string) => {
    const cart: any = await Cart.findOne({ user: userId });

    if (!cart) {
        throw new ErrorResponse('Cart not found', 404);
    }
    cart.items.pull(itemId);
    await cart.save();
    return await getCart(userId);
};

/**
 * Remove multiple items from cart
 */
export const removeMultipleFromCart = async (userId: string, itemIds: string[]) => {
    const cart: any = await Cart.findOne({ user: userId });

    if (!cart) {
        throw new ErrorResponse('Cart not found', 404);
    }

    if (!Array.isArray(itemIds) || itemIds.length === 0) {
        throw new ErrorResponse('Please provide an array of item IDs to remove', 400);
    }

    // Filter out the items to be removed
    cart.items = cart.items.filter((item: any) => !itemIds.includes(item._id.toString()));
    
    await cart.save();
    return await getCart(userId);
};

export default {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    removeMultipleFromCart
};
