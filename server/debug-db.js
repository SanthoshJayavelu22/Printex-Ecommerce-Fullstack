const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const productsCount = await mongoose.connection.db.collection('products').countDocuments();
        const categoriesCount = await mongoose.connection.db.collection('categories').countDocuments();
        console.log(`Products: ${productsCount}, Categories: ${categoriesCount}`);
        const products = await mongoose.connection.db.collection('products').find({}).limit(5).toArray();
        console.log('Sample Products:', JSON.stringify(products, null, 2));
        process.exit();
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
check();
