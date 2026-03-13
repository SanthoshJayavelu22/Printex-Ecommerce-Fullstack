"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wishlistController_1 = require("../controllers/wishlistController");
const router = express_1.default.Router();
const authMiddleware_1 = require("../middleware/authMiddleware");
router.use(authMiddleware_1.protect);
router.get('/', wishlistController_1.getWishlist);
router.post('/:productId', wishlistController_1.toggleWishlist);
exports.default = router;
//# sourceMappingURL=wishlistRoutes.js.map