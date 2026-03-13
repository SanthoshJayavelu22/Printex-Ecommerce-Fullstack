import express  from 'express';
import {
    getWishlist,
    toggleWishlist
} from '../controllers/wishlistController';

const router = express.Router();

import { protect } from '../middleware/authMiddleware';

router.use(protect);

router.get('/', getWishlist);
router.post('/:productId', toggleWishlist);

export default router;
