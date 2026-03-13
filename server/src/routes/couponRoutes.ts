import express  from 'express';
import {
    getCoupons,
    getCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon
} from '../controllers/couponController';

const router = express.Router();

import { protect, authorize } from '../middleware/authMiddleware';
import roles from '../constants/roles';

router.use(protect);

router.post('/validate', validateCoupon);

// Admin only routes
router.use(authorize(roles.ADMIN, roles.SUPER_ADMIN));

router.route('/')
    .get(getCoupons)
    .post(createCoupon);

router.route('/:id')
    .get(getCoupon)
    .put(updateCoupon)
    .delete(deleteCoupon);

export default router;
