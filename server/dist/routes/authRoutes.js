"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const authValidations_1 = require("../middleware/validations/authValidations");
const roles_1 = require("../constants/roles");
const router = express_1.default.Router();
router.post('/register', authValidations_1.validateRegister, authController_1.register);
router.post('/login', authValidations_1.validateLogin, authController_1.login);
router.post('/forgotpassword', authController_1.forgotPassword);
router.put('/resetpassword', authValidations_1.validateResetPassword, authController_1.resetPassword);
router.get('/me', authMiddleware_1.protect, authController_1.getMe);
router.put('/updateprofile', authMiddleware_1.protect, authController_1.updateProfile);
router.post('/address', authMiddleware_1.protect, authController_1.addAddress);
router.delete('/address/:id', authMiddleware_1.protect, authController_1.removeAddress);
router.post('/wishlist/:productId', authMiddleware_1.protect, authController_1.toggleWishlist);
router.get('/admin-only', authMiddleware_1.protect, (0, authMiddleware_1.authorize)(roles_1.ROLES.ADMIN, roles_1.ROLES.SUPER_ADMIN), (req, res) => {
    res.status(200).json({ success: true, message: 'Welcome Admin' });
});
router.get('/super-admin-only', authMiddleware_1.protect, (0, authMiddleware_1.authorize)(roles_1.ROLES.SUPER_ADMIN), (req, res) => {
    res.status(200).json({ success: true, message: 'Welcome Super Admin' });
});
exports.default = router;
//# sourceMappingURL=authRoutes.js.map