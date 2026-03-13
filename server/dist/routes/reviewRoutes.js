"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reviewController_1 = require("../controllers/reviewController");
const router = express_1.default.Router();
const authMiddleware_1 = require("../middleware/authMiddleware");
const roles_1 = __importDefault(require("../constants/roles"));
router.use(authMiddleware_1.protect);
router.route('/')
    .get((0, authMiddleware_1.authorize)(roles_1.default.ADMIN, roles_1.default.SUPER_ADMIN), reviewController_1.getAllReviews);
router.route('/:id')
    .put(reviewController_1.updateReview)
    .delete(reviewController_1.deleteReview);
exports.default = router;
//# sourceMappingURL=reviewRoutes.js.map