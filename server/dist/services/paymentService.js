"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignature = exports.createRazorpayOrder = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
let razorpay;
const getRazorpayInstance = () => {
    if (!razorpay) {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.error('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing from .env');
            return null;
        }
        razorpay = new razorpay_1.default({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
    }
    return razorpay;
};
/**
 * Create a Razorpay order
 */
const createRazorpayOrder = async (amount, receipt) => {
    const options = {
        amount: amount * 100, // amount in the smallest currency unit (paise for INR)
        currency: "INR",
        receipt: receipt,
    };
    try {
        const instance = getRazorpayInstance();
        if (!instance) {
            throw new errorResponse_1.default('Razorpay is not configured. Please add keys to .env', 500);
        }
        const order = await instance.orders.create(options);
        return order;
    }
    catch (error) {
        throw new errorResponse_1.default('Razorpay Order Creation Failed', 500);
    }
};
exports.createRazorpayOrder = createRazorpayOrder;
/**
 * Verify Razorpay signature
 */
const verifySignature = (orderId, paymentId, signature) => {
    if (!process.env.RAZORPAY_KEY_SECRET) {
        console.error('RAZORPAY_KEY_SECRET is missing from .env');
        return false;
    }
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto_1.default
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");
    return expectedSignature === signature;
};
exports.verifySignature = verifySignature;
exports.default = {
    createRazorpayOrder: exports.createRazorpayOrder,
    verifySignature: exports.verifySignature
};
//# sourceMappingURL=paymentService.js.map