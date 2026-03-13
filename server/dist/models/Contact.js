"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const contactSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: {
        type: String,
        required: [true, 'Please provide your phone number']
    },
    subject: {
        type: String,
        required: [true, 'Please provide a subject']
    },
    message: {
        type: String,
        required: [true, 'Please provide a message']
    },
    isRead: {
        type: Boolean,
        default: false
    },
    isReplied: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Contact', contactSchema);
//# sourceMappingURL=Contact.js.map