"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roles_1 = __importDefault(require("../constants/roles"));
const router = express_1.default.Router();
// All routes require Admin authorization
router.use(authMiddleware_1.protect);
router.use((0, authMiddleware_1.authorize)(roles_1.default.ADMIN, roles_1.default.SUPER_ADMIN));
router.get('/stats', adminController_1.getStats);
router.get('/low-stock', adminController_1.getLowStockProducts);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map