"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bannerSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: [true, 'Please provide banner title']
    },
    subtitle: {
        type: String
    },
    image: {
        type: String,
        required: [true, 'Please provide banner image']
    },
    link: {
        type: String,
        default: '/'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Banner', bannerSchema);
//# sourceMappingURL=Banner.js.map