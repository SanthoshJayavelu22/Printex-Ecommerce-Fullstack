import express  from 'express';
import {
    getCategories,
    getCategoryTree,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController';

const router = express.Router();

import { protect, authorize } from '../middleware/authMiddleware';
import roles from '../constants/roles';

// Custom route for tree must come before /:id
router.route('/tree')
    .get(getCategoryTree);

router.route('/')
    .get(getCategories)
    .post(protect, authorize(roles.ADMIN, roles.SUPER_ADMIN), createCategory);

router.route('/:id')
    .get(getCategory)
    .put(protect, authorize(roles.ADMIN, roles.SUPER_ADMIN), updateCategory)
    .delete(protect, authorize(roles.ADMIN, roles.SUPER_ADMIN), deleteCategory);

export default router;
