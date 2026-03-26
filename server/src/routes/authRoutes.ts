import express from 'express';
import { 
    register, 
    login, 
    forgotPassword, 
    resetPassword, 
    getMe, 
    updateProfile, 
    addAddress, 
    removeAddress, 
    toggleWishlist,
    verifyOTP,
    deleteProfile
} from '../controllers/authController';
import { protect, authorize } from '../middleware/authMiddleware';
import { validateRegister, validateLogin, validateResetPassword } from '../middleware/validations/authValidations';
import { ROLES } from '../constants/roles';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/verify-otp', verifyOTP);
router.post('/login', validateLogin, login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword', validateResetPassword, resetPassword);

router.get('/me', protect, getMe);
router.put('/updateprofile', protect, updateProfile);
router.post('/address', protect, addAddress);
router.delete('/address/:id', protect, removeAddress);
router.post('/wishlist/:productId', protect, toggleWishlist);
router.delete('/profile', protect, deleteProfile);

router.get('/admin-only', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), (req, res) => {
    res.status(200).json({ success: true, message: 'Welcome Admin' });
});

router.get('/super-admin-only', protect, authorize(ROLES.SUPER_ADMIN), (req, res) => {
    res.status(200).json({ success: true, message: 'Welcome Super Admin' });
});

export default router;
