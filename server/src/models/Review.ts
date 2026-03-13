import mongoose  from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
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

export default mongoose.model('Review', reviewSchema);
