import couponService from '../services/couponService';
import asyncHandler from '../middleware/asyncHandler';

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = asyncHandler(async (req, res, next) => {
    const results = await couponService.getAllCoupons(req.query);
    res.status(200).json(results);
});

// @desc    Get single coupon
// @route   GET /api/coupons/:id
// @access  Private/Admin
export const getCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await couponService.getCouponById(req.params.id as string);
    res.status(200).json({
        success: true,
        data: coupon
    });
});

// @desc    Create new coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await couponService.createCoupon(req.body);
    res.status(201).json({
        success: true,
        data: coupon
    });
});

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
export const updateCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await couponService.updateCoupon(req.params.id as string, req.body);
    res.status(200).json({
        success: true,
        data: coupon
    });
});

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = asyncHandler(async (req, res, next) => {
    await couponService.deleteCoupon(req.params.id as string);
    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Validate coupon code
// @route   POST /api/coupons/validate
// @access  Private
export const validateCoupon = asyncHandler(async (req, res, next) => {
    const { code, cartTotal } = req.body;
    const validatedData = await couponService.validateCoupon(code, cartTotal);
    res.status(200).json({
        success: true,
        data: validatedData
    });
});
