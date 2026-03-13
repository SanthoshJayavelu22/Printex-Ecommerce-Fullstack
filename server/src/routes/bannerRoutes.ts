import express  from 'express';
import {
    getBanners,
    getAdminBanners,
    createBanner,
    updateBanner,
    deleteBanner
} from '../controllers/bannerController';

const router = express.Router();

import { protect, authorize } from '../middleware/authMiddleware';
import upload from '../config/multerConfig';
import roles from '../constants/roles';

// Public route to get active banners
router.get('/', getBanners);

// Admin-only routes
router.use(protect, authorize(roles.ADMIN, roles.SUPER_ADMIN));

router.get('/admin', getAdminBanners);
router.post('/', upload.single('image'), createBanner);
router.route('/:id')
    .put(upload.single('image'), updateBanner)
    .delete(deleteBanner);

export default router;
