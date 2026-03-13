import express  from 'express';
import { verifyPayment } from '../controllers/paymentController';

const router = express.Router();

import { protect } from '../middleware/authMiddleware';

router.use(protect);

router.post('/verify', verifyPayment);

export default router;
