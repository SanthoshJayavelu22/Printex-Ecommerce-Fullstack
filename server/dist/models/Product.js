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
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a product name'],
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide product description'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Please provide price'],
        min: 0
    },
    images: [{
            type: String
        }],
    categories: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Please provide at least one category']
        }],
    stock: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    minOrderQuantity: {
        type: Number,
        default: 1
    },
    admin: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    metaTitle: {
        type: String,
        trim: true
    },
    metaDescription: {
        type: String,
        trim: true
    },
    metaKeywords: {
        type: String,
        trim: true
    },
    relatedProducts: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Product'
        }],
    defaultShape: {
        type: String,
        default: ''
    },
    defaultSize: {
        type: String,
        default: ''
    },
    defaultQuantity: {
        type: Number,
        default: null
    },
    defaultMaterial: {
        type: String,
        default: ''
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// Add mainImage virtual
productSchema.virtual('mainImage').get(function () {
    return this.images && this.images.length > 0 ? this.images[0] : '';
});
// Create indexes
productSchema.index({ categories: 1 });
const Product = mongoose_1.default.model('Product', productSchema);
exports.default = Product;
//# sourceMappingURL=Product.js.map