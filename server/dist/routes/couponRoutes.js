"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const couponController_1 = require("../controllers/couponController");
const router = express_1.default.Router();
const authMiddleware_1 = require("../middleware/authMiddleware");
const roles_1 = __importDefault(require("../constants/roles"));
router.use(authMiddleware_1.protect);
router.post('/validate', couponController_1.validateCoupon);
// Admin only routes
router.use((0, authMiddleware_1.authorize)(roles_1.default.ADMIN, roles_1.default.SUPER_ADMIN));
router.route('/')
    .get(couponController_1.getCoupons)
    .post(couponController_1.createCoupon);
router.route('/:id')
    .get(couponController_1.getCoupon)
    .put(couponController_1.updateCoupon)
    .delete(couponController_1.deleteCoupon);
exports.default = router;
//# sourceMappingURL=couponRoutes.js.map