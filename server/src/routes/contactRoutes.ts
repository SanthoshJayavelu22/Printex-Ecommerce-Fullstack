import express  from 'express';
import {
    submitInquiry,
    getInquiries,
    getInquiry,
    updateInquiry,
    deleteInquiry
} from '../controllers/contactController';

const router = express.Router();

import { protect, authorize } from '../middleware/authMiddleware';
import roles from '../constants/roles';

// Public route to submit an inquiry
router.post('/', submitInquiry);

// Admin-only routes for management
router.use(protect, authorize(roles.ADMIN, roles.SUPER_ADMIN));

router.get('/', getInquiries);
router.route('/:id')
    .get(getInquiry)
    .put(updateInquiry)
    .delete(deleteInquiry);

export default router;
