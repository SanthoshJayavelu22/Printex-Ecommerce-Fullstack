"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contactController_1 = require("../controllers/contactController");
const router = express_1.default.Router();
const authMiddleware_1 = require("../middleware/authMiddleware");
const roles_1 = __importDefault(require("../constants/roles"));
// Public route to submit an inquiry
router.post('/', contactController_1.submitInquiry);
// Admin-only routes for management
router.use(authMiddleware_1.protect, (0, authMiddleware_1.authorize)(roles_1.default.ADMIN, roles_1.default.SUPER_ADMIN));
router.get('/', contactController_1.getInquiries);
router.route('/:id')
    .get(contactController_1.getInquiry)
    .put(contactController_1.updateInquiry)
    .delete(contactController_1.deleteInquiry);
exports.default = router;
//# sourceMappingURL=contactRoutes.js.map