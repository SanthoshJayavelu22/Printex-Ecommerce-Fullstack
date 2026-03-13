"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bannerController_1 = require("../controllers/bannerController");
const router = express_1.default.Router();
const authMiddleware_1 = require("../middleware/authMiddleware");
const multerConfig_1 = __importDefault(require("../config/multerConfig"));
const roles_1 = __importDefault(require("../constants/roles"));
// Public route to get active banners
router.get('/', bannerController_1.getBanners);
// Admin-only routes
router.use(authMiddleware_1.protect, (0, authMiddleware_1.authorize)(roles_1.default.ADMIN, roles_1.default.SUPER_ADMIN));
router.get('/admin', bannerController_1.getAdminBanners);
router.post('/', multerConfig_1.default.single('image'), bannerController_1.createBanner);
router.route('/:id')
    .put(multerConfig_1.default.single('image'), bannerController_1.updateBanner)
    .delete(bannerController_1.deleteBanner);
exports.default = router;
//# sourceMappingURL=bannerRoutes.js.map