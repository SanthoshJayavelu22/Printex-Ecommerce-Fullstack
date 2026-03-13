import mongoose  from 'mongoose';

const bannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide banner title']
    },
    subtitle: {
        type: String
    },
    image: {
        type: String,
        required: [true, 'Please provide banner image']
    },
    link: {
        type: String,
        default: '/'
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

export default mongoose.model('Banner', bannerSchema);
