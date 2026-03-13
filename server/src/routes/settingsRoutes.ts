import express  from 'express';
import {
    getSettings,
    updateSettings
} from '../controllers/settingsController';

const router = express.Router();

import { protect, authorize } from '../middleware/authMiddleware';
import roles from '../constants/roles';

// Public access to site settings (logo, name etc)
router.get('/', getSettings);

// Admin-only updates
router.use(protect, authorize(roles.ADMIN, roles.SUPER_ADMIN));

router.put('/', updateSettings);

export default router;
