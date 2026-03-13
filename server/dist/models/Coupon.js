"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const couponSchema = new mongoose_1.default.Schema({
    code: {
        type: String,
        required: [true, 'Please provide a coupon code'],
        unique: true,
        uppercase: true,
        trim: true
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        default: 'percentage'
    },
    discountValue: {
        type: Number,
        required: [true, 'Please provide discount value']
    },
    minPurchase: {
        type: Number,
        default: 0
    },
    expiresAt: {
        type: Date,
        required: [true, 'Please provide expiry date']
    },
    usageLimit: {
        type: Number,
        default: null
    },
    usedCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Coupon', couponSchema);
//# sourceMappingURL=Coupon.js.map