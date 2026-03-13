import mongoose  from 'mongoose';

const contactSchema = new mongoose.Schema({
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

export default mongoose.model('Contact', contactSchema);
