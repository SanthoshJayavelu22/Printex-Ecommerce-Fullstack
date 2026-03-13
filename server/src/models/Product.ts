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
    mainImage?: string;
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
    }
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
