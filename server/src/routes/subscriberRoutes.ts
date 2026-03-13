import express  from 'express';
import {
    subscribe,
    getSubscribers
} from '../controllers/subscriberController';

const router = express.Router();

import { protect, authorize } from '../middleware/authMiddleware';
import roles from '../constants/roles';

router.post('/subscribe', subscribe);

// Admin routes
router.get('/subscribers', protect, authorize(roles.ADMIN, roles.SUPER_ADMIN), getSubscribers);

export default router;
