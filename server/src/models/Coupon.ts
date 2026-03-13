import mongoose  from 'mongoose';

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Please provide a coupon code'],
        unique: true,
        uppercase: true,
        trim: true
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        default: 'percentage'
    },
    discountValue: {
        type: Number,
        required: [true, 'Please provide discount value']
    },
    minPurchase: {
        type: Number,
        default: 0
    },
    expiresAt: {
        type: Date,
        required: [true, 'Please provide expiry date']
    },
    usageLimit: {
        type: Number,
        default: null
    },
    usedCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Coupon', couponSchema);
