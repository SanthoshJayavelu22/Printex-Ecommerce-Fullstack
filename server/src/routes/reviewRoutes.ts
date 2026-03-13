import express  from 'express';
import {
    getAllReviews,
    updateReview,
    deleteReview
} from '../controllers/reviewController';

const router = express.Router();

import { protect, authorize } from '../middleware/authMiddleware';
import roles from '../constants/roles';

router.use(protect);

router.route('/')
    .get(authorize(roles.ADMIN, roles.SUPER_ADMIN), getAllReviews);

router.route('/:id')
    .put(updateReview)
    .delete(deleteReview);

export default router;
