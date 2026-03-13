"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subscriberController_1 = require("../controllers/subscriberController");
const router = express_1.default.Router();
const authMiddleware_1 = require("../middleware/authMiddleware");
const roles_1 = __importDefault(require("../constants/roles"));
router.post('/subscribe', subscriberController_1.subscribe);
// Admin routes
router.get('/subscribers', authMiddleware_1.protect, (0, authMiddleware_1.authorize)(roles_1.default.ADMIN, roles_1.default.SUPER_ADMIN), subscriberController_1.getSubscribers);
exports.default = router;
//# sourceMappingURL=subscriberRoutes.js.map