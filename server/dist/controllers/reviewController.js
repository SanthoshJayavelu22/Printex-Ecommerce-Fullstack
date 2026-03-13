"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.updateReview = exports.addReview = exports.getProductReviews = exports.getAllReviews = void 0;
const Review_1 = __importDefault(require("../models/Review"));
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
const activityController_1 = require("./activityController");
// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Private/Admin
exports.getAllReviews = (0, asyncHandler_1.default)(async (req, res, next) => {
    const reviews = await Review_1.default.find().populate('user', 'name').populate('product', 'name');
    res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
    });
});
// @desc    Get all reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
exports.getProductReviews = (0, asyncHandler_1.default)(async (req, res, next) => {
    // Only return approved reviews for public view
    const reviews = await Review_1.default.find({
        product: req.params.productId,
        isApproved: true
    }).populate('user', 'name');
    res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
    });
});
// @desc    Add a review
// @route   POST /api/products/:productId/reviews
// @access  Private
exports.addReview = (0, asyncHandler_1.default)(async (req, res, next) => {
    req.body.product = req.params.productId;
    req.body.user = req.user.id;
    const review = await Review_1.default.create(req.body);
    res.status(201).json({
        success: true,
        data: review
    });
});
// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = (0, asyncHandler_1.default)(async (req, res, next) => {
    let review = await Review_1.default.findById(req.params.id);
    if (!review) {
        return next(new errorResponse_1.default(`Review not found with id of ${req.params.id}`, 404));
    }
    // Make sure review belongs to user or user is admin
    const isAdmin = req.user.role === 'admin' || req.user.role === 'super-admin';
    if (review.user.toString() !== req.user.id && !isAdmin) {
        return next(new errorResponse_1.default(`Not authorized to update review`, 401));
    }
    const oldStatus = review.isApproved;
    review = await Review_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (req.user.role === 'admin' || req.user.role === 'super-admin') {
        if (oldStatus !== review.isApproved) {
            const action = review.isApproved ? 'APPROVED' : 'UNAPPROVED';
            await (0, activityController_1.logActivity)(req.user.id, 'UPDATE', 'REVIEW', `Review ${review._id} ${action}`, req);
        }
    }
    res.status(200).json({
        success: true,
        data: review
    });
});
// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = (0, asyncHandler_1.default)(async (req, res, next) => {
    const review = await Review_1.default.findById(req.params.id);
    if (!review) {
        return next(new errorResponse_1.default(`Review not found with id of ${req.params.id}`, 404));
    }
    // Make sure review belongs to user or user is admin
    const isAdmin = req.user.role === 'admin' || req.user.role === 'super-admin';
    if (review.user.toString() !== req.user.id && !isAdmin) {
        return next(new errorResponse_1.default(`Not authorized to delete review`, 401));
    }
    if (isAdmin) {
        await (0, activityController_1.logActivity)(req.user.id, 'DELETE', 'REVIEW', `Review ${review._id} deleted by admin`, req);
    }
    await review.deleteOne();
    res.status(200).json({
        success: true,
        data: {}
    });
});
//# sourceMappingURL=reviewController.js.map