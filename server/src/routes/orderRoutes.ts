import express  from 'express';
import {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    cancelOrder
} from '../controllers/orderController';

const router = express.Router();

import { protect, authorize } from '../middleware/authMiddleware';
import roles from '../constants/roles';

import { orderValidators } from '../middleware/validations/commonValidations';

// Apply protection to all routes
router.use(protect);

router.route('/')
    .post(orderValidators, createOrder)
    .get(authorize(roles.ADMIN, roles.SUPER_ADMIN), getAllOrders);

router.route('/myorders')
    .get(getMyOrders);

router.route('/:id')
    .get(getOrderById);

router.route('/:id/cancel')
    .put(cancelOrder);

router.route('/:id/status')
    .put(authorize(roles.ADMIN, roles.SUPER_ADMIN), updateOrderStatus);

export default router;
