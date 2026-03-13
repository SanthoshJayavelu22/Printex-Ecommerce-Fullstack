import express  from 'express';
import { getStats, getLowStockProducts } from '../controllers/adminController';
import { protect, authorize } from '../middleware/authMiddleware';
import roles from '../constants/roles';

const router = express.Router();

// All routes require Admin authorization
router.use(protect);
router.use(authorize(roles.ADMIN, roles.SUPER_ADMIN));

router.get('/stats', getStats);
router.get('/low-stock', getLowStockProducts);

export default router;
