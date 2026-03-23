const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

async function seedOne() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Category = mongoose.model('Category', new mongoose.Schema({
            name: String,
            slug: String,
            parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }
        }));
        
        const Product = mongoose.model('Product', new mongoose.Schema({
            name: String,
            slug: String,
            categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
            isDeleted: { type: Boolean, default: false },
            isActive: { type: Boolean, default: true },
            price: Number,
            images: [String]
        }));
        
        // Find existing category slug
        let cat = await Category.findOne({ slug: 'paper-bags-pouch' });
        if (!cat) {
            cat = await Category.create({ name: 'Paper Bags & Pouch', slug: 'paper-bags-pouch' });
            console.log('Created missing category');
        }
        
        const count = await Product.countDocuments({ categories: cat._id });
        if (count === 0) {
            await Product.create({
                name: 'TEST PRODUCT 1',
                slug: 'test-product-1',
                categories: [cat._id],
                price: 100,
                images: ['https://via.placeholder.com/300']
            });
            console.log('Product created for Paper Bags & Pouch');
        } else {
            console.log('Product already exists');
        }
        process.exit();
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
seedOne();
