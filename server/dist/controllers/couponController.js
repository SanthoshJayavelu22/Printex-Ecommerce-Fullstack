"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCoupon = exports.deleteCoupon = exports.updateCoupon = exports.createCoupon = exports.getCoupon = exports.getCoupons = void 0;
const Coupon_1 = __importDefault(require("../models/Coupon"));
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
const activityController_1 = require("./activityController");
// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
exports.getCoupons = (0, asyncHandler_1.default)(async (req, res, next) => {
    const coupons = await Coupon_1.default.find();
    res.status(200).json({
        success: true,
        count: coupons.length,
        data: coupons
    });
});
// @desc    Get single coupon
// @route   GET /api/coupons/:id
// @access  Private/Admin
exports.getCoupon = (0, asyncHandler_1.default)(async (req, res, next) => {
    const coupon = await Coupon_1.default.findById(req.params.id);
    if (!coupon) {
        return next(new errorResponse_1.default(`Coupon not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        data: coupon
    });
});
// @desc    Create new coupon
// @route   POST /api/coupons
// @access  Private/Admin
exports.createCoupon = (0, asyncHandler_1.default)(async (req, res, next) => {
    const coupon = await Coupon_1.default.create(req.body);
    await (0, activityController_1.logActivity)(req.user.id, 'CREATE', 'COUPON', `Coupon created: ${coupon.code}`, req);
    res.status(201).json({
        success: true,
        data: coupon
    });
});
// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
exports.updateCoupon = (0, asyncHandler_1.default)(async (req, res, next) => {
    let coupon = await Coupon_1.default.findById(req.params.id);
    if (!coupon) {
        return next(new errorResponse_1.default(`Coupon not found with id of ${req.params.id}`, 404));
    }
    coupon = await Coupon_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    await (0, activityController_1.logActivity)(req.user.id, 'UPDATE', 'COUPON', `Coupon updated: ${coupon.code}`, req);
    res.status(200).json({
        success: true,
        data: coupon
    });
});
// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
exports.deleteCoupon = (0, asyncHandler_1.default)(async (req, res, next) => {
    const coupon = await Coupon_1.default.findById(req.params.id);
    if (!coupon) {
        return next(new errorResponse_1.default(`Coupon not found with id of ${req.params.id}`, 404));
    }
    await coupon.deleteOne();
    await (0, activityController_1.logActivity)(req.user.id, 'DELETE', 'COUPON', `Coupon ID deleted: ${req.params.id}`, req);
    res.status(200).json({
        success: true,
        data: {}
    });
});
// @desc    Validate coupon code
// @route   POST /api/coupons/validate
// @access  Private
exports.validateCoupon = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { code, cartTotal } = req.body;
    const coupon = await Coupon_1.default.findOne({ code, isActive: true });
    if (!coupon) {
        return next(new errorResponse_1.default('Invalid or inactive coupon code', 400));
    }
    if (new Date() > coupon.expiresAt) {
        return next(new errorResponse_1.default('Coupon has expired', 400));
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return next(new errorResponse_1.default('Coupon usage limit reached', 400));
    }
    if (cartTotal < coupon.minPurchase) {
        return next(new errorResponse_1.default(`Minimum purchase of ${coupon.minPurchase} required for this coupon`, 400));
    }
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
        discountAmount = (cartTotal * coupon.discountValue) / 100;
    }
    else {
        discountAmount = coupon.discountValue;
    }
    res.status(200).json({
        success: true,
        data: {
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            discountAmount
        }
    });
});
//# sourceMappingURL=couponController.js.map