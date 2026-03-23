const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

async function debug() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const slug = 'paper-bags-pouch';
        const category = await mongoose.connection.db.collection('categories').findOne({ slug });
        if (!category) {
            console.log('CATEGORY NOT FOUND IN DB');
            process.exit(1);
        }
        console.log('CATEGORY FOUND:', category._id, category.name);
        
        // Find all children
        const children = await mongoose.connection.db.collection('categories').find({ parent: category._id }).toArray();
        const categoryIds = [category._id, ...children.map(c => c._id)];
        console.log('CATEGORY IDS FOR QUERY:', categoryIds);
        
        const products = await mongoose.connection.db.collection('products').find({
            categories: { $in: categoryIds },
            isDeleted: false
        }).toArray();
        
        console.log('PRODUCTS COUNT:', products.length);
        if (products.length > 0) {
            console.log('SAMPLE PRODUCT CATEGORIES:', products[0].categories);
        } else {
             const allProds = await mongoose.connection.db.collection('products').find({}).limit(1).toArray();
             if (allProds.length > 0) {
                 console.log('ONE ACTUAL PRODUCT CATEGORIES:', allProds[0].categories);
             } else {
                 console.log('NO PRODUCTS AT ALL IN DB');
             }
        }
        process.exit();
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
debug();
