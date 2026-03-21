import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    slug: string;
    description: string;
    price: number;
    images: string[];
    categories: mongoose.Types.ObjectId[];
    stock: number;
    isActive: boolean;
    isDeleted: boolean;
    minOrderQuantity: number;
    admin?: mongoose.Types.ObjectId;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    relatedProducts: mongoose.Types.ObjectId[];
    defaultShape?: string;
    defaultSize?: string;
    defaultQuantity?: number | null;
    defaultMaterial?: string;
    availableShapes?: string[];
    availableSizes?: string[];
    availableMaterials?: string[];
    availableQuantities?: number[];
    fixedShape: boolean;
    fixedSize: boolean;
    fixedMaterial: boolean;
    fixedQuantity: boolean;
    mainImage?: string;
    quantityDiscounts?: {
        minQuantity: number;
        discountPercentage: number;
    }[];
}

const productSchema: Schema<IProduct> = new Schema({
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
        type: mongoose.Schema.Types.ObjectId,
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
        type: mongoose.Schema.Types.ObjectId,
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
        type: mongoose.Schema.Types.ObjectId,
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
    },
    availableShapes: {
        type: [String],
        default: []
    },
    availableSizes: {
        type: [String],
        default: []
    },
    availableMaterials: {
        type: [String],
        default: []
    },
    availableQuantities: {
        type: [Number],
        default: []
    },
    fixedShape: {
        type: Boolean,
        default: false
    },
    fixedSize: {
        type: Boolean,
        default: false
    },
    fixedMaterial: {
        type: Boolean,
        default: false
    },
    fixedQuantity: {
        type: Boolean,
        default: false
    },
    quantityDiscounts: [{
        minQuantity: {
            type: Number,
            required: true
        },
        discountPercentage: {
            type: Number,
            required: true
        }
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add mainImage virtual
productSchema.virtual('mainImage').get(function(this: IProduct) {
    return this.images && this.images.length > 0 ? this.images[0] : '';
});

// Create indexes
productSchema.index({ categories: 1 });

const Product: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema);
export default Product;
