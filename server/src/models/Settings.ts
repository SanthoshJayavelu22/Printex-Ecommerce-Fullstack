import mongoose  from 'mongoose';

const settingsSchema = new mongoose.Schema({
    logo: {
        type: String,
        default: '/logo.png'
    },
    storeName: {
        type: String,
        default: 'Printix Labels'
    },
    contactEmail: {
        type: String,
        default: 'contact@printixlabels.com'
    },
    contactPhone: {
        type: String,
        default: '+91 123 456 7890'
    },
    address: {
        type: String,
        default: 'Surat, Gujarat, India'
    },
    socialLinks: {
        facebook: { type: String, default: 'https://facebook.com' },
        instagram: { type: String, default: 'https://instagram.com' },
        twitter: { type: String, default: 'https://twitter.com' },
        linkedin: { type: String, default: 'https://linkedin.com' }
    },
    seo: {
        metaTitle: { type: String, default: 'Printix Labels - Premium Custom Sticker Printing' },
        metaDescription: { type: String, default: 'Get high quality custom stickers and labels delivered to your doorstep.' },
        metaKeywords: { type: String, default: 'stickers, labels, custom printing, India, ecommerce' }
    },
    footerText: {
        type: String,
        default: '© 2026 Printix Labels. All Rights Reserved.'
    },
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    taxRate: {
        type: Number,
        default: 18
    }
}, {
    timestamps: true
});

export default mongoose.model('Settings', settingsSchema);
