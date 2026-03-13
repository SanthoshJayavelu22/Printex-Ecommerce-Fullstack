"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const settingsSchema = new mongoose_1.default.Schema({
    logo: {
        type: String,
        default: '/logo.png'
    },
    storeName: {
        type: String,
        default: 'Tridev Ecommerce'
    },
    contactEmail: {
        type: String,
        default: 'contact@tridevecommerce.com'
    },
    contactPhone: {
        type: String,
        default: '+91 123 456 7890'
    },
    address: {
        type: String,
        default: 'Surat, Gujarat, India'
    },
    socialLinks: {
        facebook: { type: String, default: 'https://facebook.com' },
        instagram: { type: String, default: 'https://instagram.com' },
        twitter: { type: String, default: 'https://twitter.com' },
        linkedin: { type: String, default: 'https://linkedin.com' }
    },
    seo: {
        metaTitle: { type: String, default: 'Tridev Ecommerce - Best Stickers in India' },
        metaDescription: { type: String, default: 'Get high quality custom stickers and labels delivered to your doorstep.' },
        metaKeywords: { type: String, default: 'stickers, labels, custom printing, India, ecommerce' }
    },
    footerText: {
        type: String,
        default: '© 2026 Tridev Ecommerce. All Rights Reserved.'
    },
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    taxRate: {
        type: Number,
        default: 18
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Settings', settingsSchema);
//# sourceMappingURL=Settings.js.map