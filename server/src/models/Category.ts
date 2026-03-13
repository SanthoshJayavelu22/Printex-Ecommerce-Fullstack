import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    slug: string;
    parent: mongoose.Types.ObjectId | null;
    image?: string;
    icon?: string;
    isActive: boolean;
    order: number;
}

const categorySchema: Schema<ICategory> = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a category name'],
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    image: {
        type: String
    },
    icon: {
        type: String
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

// Create index for fast retrieval
categorySchema.index({ parent: 1 });

const Category: Model<ICategory> = mongoose.model<ICategory>('Category', categorySchema);
export default Category;
