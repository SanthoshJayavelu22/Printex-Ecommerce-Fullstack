"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const settingsController_1 = require("../controllers/settingsController");
const router = express_1.default.Router();
const authMiddleware_1 = require("../middleware/authMiddleware");
const roles_1 = __importDefault(require("../constants/roles"));
// Public access to site settings (logo, name etc)
router.get('/', settingsController_1.getSettings);
// Admin-only updates
router.use(authMiddleware_1.protect, (0, authMiddleware_1.authorize)(roles_1.default.ADMIN, roles_1.default.SUPER_ADMIN));
router.put('/', settingsController_1.updateSettings);
exports.default = router;
//# sourceMappingURL=settingsRoutes.js.map