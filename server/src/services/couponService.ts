import Coupon from '../models/Coupon';
import ErrorResponse from '../utils/errorResponse';
import advancedResults from '../utils/advancedResults';

/**
 * Service to handle Coupon business logic
 */
class CouponService {
    /**
     * Get all coupons with pagination/filtering
     */
    async getAllCoupons(reqQuery: any) {
        return await advancedResults(Coupon as any, reqQuery);
    }

    /**
     * Get single coupon
     */
    async getCouponById(id: string) {
        const coupon = await Coupon.findById(id);
        if (!coupon) {
            throw new ErrorResponse(`Coupon not found with id of ${id}`, 404);
        }
        return coupon;
    }

    /**
     * Create coupon
     */
    async createCoupon(data: any) {
        return await Coupon.create(data);
    }

    /**
     * Update coupon
     */
    async updateCoupon(id: string, data: any) {
        let coupon = await Coupon.findById(id);
        if (!coupon) {
            throw new ErrorResponse(`Coupon not found with id of ${id}`, 404);
        }
        return await Coupon.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        });
    }

    /**
     * Delete coupon
     */
    async deleteCoupon(id: string) {
        const coupon = await Coupon.findById(id);
        if (!coupon) {
            throw new ErrorResponse(`Coupon not found with id of ${id}`, 404);
        }
        await coupon.deleteOne();
        return true;
    }

    /**
     * Validate coupon code
     */
    async validateCoupon(code: string, cartTotal: number) {
        const coupon = await Coupon.findOne({ code, isActive: true });

        if (!coupon) {
            throw new ErrorResponse('Invalid or inactive coupon code', 400);
        }

        if (new Date() > coupon.expiresAt) {
            throw new ErrorResponse('Coupon has expired', 400);
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            throw new ErrorResponse('Coupon usage limit reached', 400);
        }

        if (cartTotal < coupon.minPurchase) {
            throw new ErrorResponse(`Minimum purchase of ${coupon.minPurchase} required for this coupon`, 400);
        }

        let discountAmount = 0;
        if (coupon.discountType === 'percentage') {
            discountAmount = (cartTotal * coupon.discountValue) / 100;
        } else {
            discountAmount = coupon.discountValue;
        }

        return {
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            discountAmount
        };
    }
}

export default new CouponService();
