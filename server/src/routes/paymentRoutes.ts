import express  from 'express';
import { verifyPayment, razorpayWebhook } from '../controllers/paymentController';

const router = express.Router();

router.post('/razorpay-webhook', razorpayWebhook);

import { protect } from '../middleware/authMiddleware';

router.use(protect);

router.post('/verify', verifyPayment);

export default router;
