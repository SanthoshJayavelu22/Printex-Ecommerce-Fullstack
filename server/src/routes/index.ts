import { Router } from 'express';
import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import cartRoutes from './cartRoutes';
import orderRoutes from './orderRoutes';
import categoryRoutes from './categoryRoutes';
import adminRoutes from './adminRoutes';
import couponRoutes from './couponRoutes';
import userRoutes from './userRoutes';
import reviewRoutes from './reviewRoutes';
import paymentRoutes from './paymentRoutes';
import contactRoutes from './contactRoutes';
import wishlistRoutes from './wishlistRoutes';
import newsletterRoutes from './subscriberRoutes';
import bannerRoutes from './bannerRoutes';
import settingsRoutes from './settingsRoutes';
import activityRoutes from './activityRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/categories', categoryRoutes);
router.use('/admin', adminRoutes);
router.use('/coupons', couponRoutes);
router.use('/users', userRoutes);
router.use('/reviews', reviewRoutes);
router.use('/payment', paymentRoutes);
router.use('/contacts', contactRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/banners', bannerRoutes);
router.use('/settings', settingsRoutes);
router.use('/activities', activityRoutes);

export default router;
