"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../controllers/cartController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const multerConfig_1 = __importDefault(require("../config/multerConfig"));
const router = express_1.default.Router();
router.use(authMiddleware_1.protect);
router.route('/')
    .get(cartController_1.getCart)
    .post(multerConfig_1.default.single('designFile'), cartController_1.addItem);
router.post('/remove', cartController_1.removeItems);
router.route('/:itemId')
    .put(cartController_1.updateItem)
    .delete(cartController_1.removeItem);
exports.default = router;
//# sourceMappingURL=cartRoutes.js.map