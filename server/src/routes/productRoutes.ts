import express  from 'express';
import { 
    getProducts, 
    getProduct, 
    getProductBySlug,
    addProduct, 
    updateProduct, 
    deleteProduct,
    getProductsByCategory
} from '../controllers/productController';
import { getProductReviews, addReview } from '../controllers/reviewController';

import { protect, authorize } from '../middleware/authMiddleware';
import upload from '../config/multerConfig';
import roles from '../constants/roles';

const router = express.Router();

// Fields configuration for multer
const productUpload = upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'additionalImages', maxCount: 5 }
]);

router.route('/category/:slug')
    .get(getProductsByCategory);

router.route('/slug/:slug')
    .get(getProductBySlug);

router.route('/')
    .get(getProducts)
    .post(protect, authorize(roles.ADMIN, roles.SUPER_ADMIN), productUpload, addProduct);

router.route('/:id')
    .get(getProduct)
    .put(protect, authorize(roles.ADMIN, roles.SUPER_ADMIN), productUpload, updateProduct)
    .delete(protect, authorize(roles.ADMIN, roles.SUPER_ADMIN), deleteProduct);

// Nested Review Routes
router.route('/:productId/reviews')
    .get(getProductReviews)
    .post(protect, addReview);

export default router;
