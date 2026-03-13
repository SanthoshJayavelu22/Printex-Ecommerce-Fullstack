import express  from 'express';
import { getCart, addItem, updateItem, removeItem, removeItems } from '../controllers/cartController';
import { protect } from '../middleware/authMiddleware';
import upload from '../config/multerConfig';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getCart)
    .post(upload.single('designFile'), addItem);

router.post('/remove', removeItems);

router.route('/:itemId')
    .put(updateItem)
    .delete(removeItem);

export default router;
