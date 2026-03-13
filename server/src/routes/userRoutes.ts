import express  from 'express';
import {
    getUsers,
    getUser,
    updateUser,
    deleteUser
} from '../controllers/userController';

const router = express.Router();

import { protect, authorize } from '../middleware/authMiddleware';
import roles from '../constants/roles';

router.use(protect);
router.use(authorize(roles.ADMIN, roles.SUPER_ADMIN));

router.route('/')
    .get(getUsers);

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

export default router;
