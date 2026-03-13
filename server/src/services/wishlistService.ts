import Wishlist from '../models/Wishlist';
import ErrorResponse from '../utils/errorResponse';

/**
 * Service to handle wishlist business logic
 */
class WishlistService {
    /**
     * Get user wishlist
     */
    async getWishlist(userId: string) {
        let wishlist = await Wishlist.findOne({ user: userId }).populate('products');

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: userId, products: [] });
        }

        return wishlist;
    }

    /**
     * Toggle product in wishlist
     */
    async toggleWishlist(userId: string, productId: string) {
        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: userId, products: [] });
        }

        const index = wishlist.products.indexOf(productId as any);

        if (index === -1) {
            // Add
            wishlist.products.push(productId as any);
        } else {
            // Remove
            wishlist.products.splice(index, 1);
        }

        await wishlist.save();
        return wishlist;
    }
}

export default new WishlistService();
