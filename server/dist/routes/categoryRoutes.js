"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("../controllers/categoryController");
const router = express_1.default.Router();
const authMiddleware_1 = require("../middleware/authMiddleware");
const roles_1 = __importDefault(require("../constants/roles"));
// Custom route for tree must come before /:id
router.route('/tree')
    .get(categoryController_1.getCategoryTree);
router.route('/')
    .get(categoryController_1.getCategories)
    .post(authMiddleware_1.protect, (0, authMiddleware_1.authorize)(roles_1.default.ADMIN, roles_1.default.SUPER_ADMIN), categoryController_1.createCategory);
router.route('/:id')
    .get(categoryController_1.getCategory)
    .put(authMiddleware_1.protect, (0, authMiddleware_1.authorize)(roles_1.default.ADMIN, roles_1.default.SUPER_ADMIN), categoryController_1.updateCategory)
    .delete(authMiddleware_1.protect, (0, authMiddleware_1.authorize)(roles_1.default.ADMIN, roles_1.default.SUPER_ADMIN), categoryController_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=categoryRoutes.js.map