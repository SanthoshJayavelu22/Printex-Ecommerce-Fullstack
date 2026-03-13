"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
const authMiddleware_1 = require("../middleware/authMiddleware");
const roles_1 = __importDefault(require("../constants/roles"));
router.use(authMiddleware_1.protect);
router.use((0, authMiddleware_1.authorize)(roles_1.default.ADMIN, roles_1.default.SUPER_ADMIN));
router.route('/')
    .get(userController_1.getUsers);
router.route('/:id')
    .get(userController_1.getUser)
    .put(userController_1.updateUser)
    .delete(userController_1.deleteUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map