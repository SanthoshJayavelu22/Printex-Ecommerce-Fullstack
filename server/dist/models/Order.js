"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const orderSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
            product: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            selectedSize: { type: String },
            selectedFinish: { type: String },
            image: { type: String },
            designUrl: { type: String },
            needsDesign: { type: Boolean, default: false }
        }],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true },
        addressType: {
            type: String,
            enum: ['Home', 'Office'],
            default: 'Home'
        }
    },
    paymentInfo: {
        id: { type: String },
        status: { type: String, default: 'Pending' },
        method: { type: String, default: 'COD' }
    },
    totalAmount: {
        type: Number,
        required: true,
        default: 0.0
    },
    coupon: {
        code: String,
        discount: Number
    },
    orderStatus: {
        type: String,
        required: true,
        default: 'Processing',
        enum: ['Pending', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Rejected'],
        index: true
    },
    deliveryTracking: {
        trackingNumber: { type: String },
        courierName: { type: String },
        trackingUrl: { type: String }
    },
    deliveredAt: {
        type: Date
    }
}, {
    timestamps: true
});
const Order = mongoose_1.default.model('Order', orderSchema);
exports.default = Order;
//# sourceMappingURL=Order.js.map