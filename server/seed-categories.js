const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const Product = require('./models/Product');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

const categories = [
    { name: 'Electronics', slug: 'electronics', order: 1 },
    { name: 'Clothing', slug: 'clothing', order: 2 },
    { name: 'Home & Kitchen', slug: 'home-kitchen', order: 3 }
];

const subCategories = [
    { name: 'Laptops', slug: 'laptops', order: 1, parentSlug: 'electronics' },
    { name: 'Smartphones', slug: 'smartphones', order: 2, parentSlug: 'electronics' },
    { name: 'Men\'s Fashion', slug: 'mens-fashion', order: 1, parentSlug: 'clothing' },
    { name: 'Women\'s Fashion', slug: 'womens-fashion', order: 2, parentSlug: 'clothing' }
];

const subSubCategories = [
    { name: 'Gaming Laptops', slug: 'gaming-laptops', order: 1, parentSlug: 'laptops' },
    { name: 'Business Laptops', slug: 'business-laptops', order: 2, parentSlug: 'laptops' }
];

const importData = async () => {
    try {
        await Category.deleteMany();
        await Product.deleteMany();
        console.log('Data Destroyed...');

        const createdCategories = await Category.insertMany(categories);
        console.log('Categories Imported...');

        // Insert subcategories
        for (const sub of subCategories) {
            const parent = createdCategories.find(c => c.slug === sub.parentSlug);
            const created = await Category.create({
                name: sub.name,
                slug: sub.slug,
                order: sub.order,
                parent: parent._id
            });
            sub.id = created._id; // store for next level
        }
        console.log('Subcategories Imported...');

        // Insert sub-sub-categories
        const allCats = await Category.find();
        for (const subSub of subSubCategories) {
            const parent = allCats.find(c => c.slug === subSub.parentSlug);
            await Category.create({
                name: subSub.name,
                slug: subSub.slug,
                order: subSub.order,
                parent: parent._id
            });
        }
        console.log('Sub-subcategories Imported...');

        // Insert products
        const gamingLaptopCat = await Category.findOne({ slug: 'gaming-laptops' });
        const mensFashionCat = await Category.findOne({ slug: 'mens-fashion' });

        await Product.create({
            name: 'Asus ROG Strix',
            slug: 'asus-rog-strix',
            description: 'Powerful gaming laptop with RTX 4070.',
            price: 1500,
            images: ['https://via.placeholder.com/800x600?text=Laptop'],
            categories: [gamingLaptopCat._id],
            stock: 20
        });

        await Product.create({
            name: 'Graphic T-Shirt',
            slug: 'graphic-t-shirt',
            description: 'Cotton T-Shirt with cool graphics.',
            price: 25,
            images: ['https://via.placeholder.com/800x600?text=T-Shirt'],
            categories: [mensFashionCat._id],
            stock: 100
        });
        console.log('Products Imported...');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

importData();
