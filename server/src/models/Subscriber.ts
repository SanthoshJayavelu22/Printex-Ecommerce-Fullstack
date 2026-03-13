import mongoose  from 'mongoose';

const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Subscriber', subscriberSchema);
