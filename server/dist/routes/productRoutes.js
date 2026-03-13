"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const reviewController_1 = require("../controllers/reviewController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const multerConfig_1 = __importDefault(require("../config/multerConfig"));
const roles_1 = __importDefault(require("../constants/roles"));
const router = express_1.default.Router();
// Fields configuration for multer
const productUpload = multerConfig_1.default.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'additionalImages', maxCount: 5 }
]);
router.route('/category/:slug')
    .get(productController_1.getProductsByCategory);
router.route('/slug/:slug')
    .get(productController_1.getProductBySlug);
router.route('/')
    .get(productController_1.getProducts)
    .post(authMiddleware_1.protect, (0, authMiddleware_1.authorize)(roles_1.default.ADMIN, roles_1.default.SUPER_ADMIN), productUpload, productController_1.addProduct);
router.route('/:id')
    .get(productController_1.getProduct)
    .put(authMiddleware_1.protect, (0, authMiddleware_1.authorize)(roles_1.default.ADMIN, roles_1.default.SUPER_ADMIN), productUpload, productController_1.updateProduct)
    .delete(authMiddleware_1.protect, (0, authMiddleware_1.authorize)(roles_1.default.ADMIN, roles_1.default.SUPER_ADMIN), productController_1.deleteProduct);
// Nested Review Routes
router.route('/:productId/reviews')
    .get(reviewController_1.getProductReviews)
    .post(authMiddleware_1.protect, reviewController_1.addReview);
exports.default = router;
//# sourceMappingURL=productRoutes.js.map