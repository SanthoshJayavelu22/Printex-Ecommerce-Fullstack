import mongoose  from 'mongoose';

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity can not be less than 1'],
            default: 1
        },
        selectedSize: {
            type: String,
            required: false // Optional depending on if the product needs it
        },
        selectedFinish: {
            type: String,
            required: false // Optional
        },
        designUrl: {
            type: String,
            required: false
        },
        needsDesign: {
            type: Boolean,
            default: false
        }
    }]
}, {
    timestamps: true
});

export default mongoose.model('Cart', cartSchema);
