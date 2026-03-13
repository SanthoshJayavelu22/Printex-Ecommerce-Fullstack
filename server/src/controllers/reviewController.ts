import reviewService from '../services/reviewService';
import asyncHandler from '../middleware/asyncHandler';

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Private/Admin
export const getAllReviews = asyncHandler(async (req, res, next) => {
    const results = await reviewService.getAllReviews(req.query);
    res.status(200).json(results);
});

// @desc    Get all reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
export const getProductReviews = asyncHandler(async (req, res, next) => {
    const reviews = await reviewService.getProductReviews(req.params.productId as string);

    res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
    });
});

// @desc    Add a review
// @route   POST /api/products/:productId/reviews
// @access  Private
export const addReview = asyncHandler(async (req, res, next) => {
    const review = await reviewService.addReview(req.params.productId as string, req.user.id, req.body);

    res.status(201).json({
        success: true,
        data: review
    });
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = asyncHandler(async (req, res, next) => {
    const review = await reviewService.updateReview(req.params.id as string, req.user.id, req.user.role, req.body);

    res.status(200).json({
        success: true,
        data: review
    });
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = asyncHandler(async (req, res, next) => {
    await reviewService.deleteReview(req.params.id as string, req.user.id, req.user.role);

    res.status(200).json({
        success: true,
        data: {}
    });
});
