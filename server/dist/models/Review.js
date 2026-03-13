"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Please provide a rating between 1 and 5'],
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: [true, 'Please provide a comment'],
        trim: true
    },
    isApproved: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
// Prevent user from submitting more than one review per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
exports.default = mongoose_1.default.model('Review', reviewSchema);
//# sourceMappingURL=Review.js.map