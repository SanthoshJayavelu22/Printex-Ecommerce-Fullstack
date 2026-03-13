"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const router = express_1.default.Router();
const authMiddleware_1 = require("../middleware/authMiddleware");
const roles_1 = __importDefault(require("../constants/roles"));
// Apply protection to all routes
router.use(authMiddleware_1.protect);
router.route('/')
    .post(orderController_1.createOrder)
    .get((0, authMiddleware_1.authorize)(roles_1.default.ADMIN, roles_1.default.SUPER_ADMIN), orderController_1.getAllOrders);
router.route('/myorders')
    .get(orderController_1.getMyOrders);
router.route('/:id')
    .get(orderController_1.getOrderById);
router.route('/:id/cancel')
    .put(orderController_1.cancelOrder);
router.route('/:id/status')
    .put((0, authMiddleware_1.authorize)(roles_1.default.ADMIN, roles_1.default.SUPER_ADMIN), orderController_1.updateOrderStatus);
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map