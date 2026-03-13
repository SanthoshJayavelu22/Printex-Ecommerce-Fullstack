import Review from '../models/Review';
import ErrorResponse from '../utils/errorResponse';
import advancedResults from '../utils/advancedResults';

class ReviewService {
    /**
     * Get all reviews with advanced results (for admin)
     */
    async getAllReviews(reqQuery: any) {
        return await advancedResults(Review, reqQuery, [
            { path: 'user', select: 'name' },
            { path: 'product', select: 'name' }
        ]);
    }

    /**
     * Get approved reviews for a product
     */
    async getProductReviews(productId: string) {
        return await Review.find({ 
            product: productId,
            isApproved: true 
        }).populate('user', 'name');
    }

    /**
     * Add a review
     */
    async addReview(productId: string, userId: string, reviewData: any) {
        reviewData.product = productId;
        reviewData.user = userId;

        return await Review.create(reviewData);
    }

    /**
     * Update a review
     */
    async updateReview(reviewId: string, userId: string, userRole: string, updateData: any) {
        const review = await Review.findById(reviewId);

        if (!review) {
            throw new ErrorResponse(`Review not found with id of ${reviewId}`, 404);
        }

        // Authorization check
        const isAdmin = userRole === 'admin' || userRole === 'super-admin';
        if (review.user.toString() !== userId && !isAdmin) {
            throw new ErrorResponse(`Not authorized to update review`, 401);
        }

        return await Review.findByIdAndUpdate(reviewId, updateData, {
            new: true,
            runValidators: true
        });
    }

    /**
     * Delete a review
     */
    async deleteReview(reviewId: string, userId: string, userRole: string) {
        const review = await Review.findById(reviewId);

        if (!review) {
            throw new ErrorResponse(`Review not found with id of ${reviewId}`, 404);
        }

        // Authorization check
        const isAdmin = userRole === 'admin' || userRole === 'super-admin';
        if (review.user.toString() !== userId && !isAdmin) {
            throw new ErrorResponse(`Not authorized to delete review`, 401);
        }

        await review.deleteOne();
        return true;
    }
}

export default new ReviewService();
