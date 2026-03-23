const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const productsCount = await mongoose.connection.db.collection('products').countDocuments();
        const categoriesCount = await mongoose.connection.db.collection('categories').countDocuments();
        const data = `Products: ${productsCount}, Categories: ${categoriesCount}`;
        fs.writeFileSync('db-results.txt', data);
        process.exit();
    } catch(e) {
        fs.writeFileSync('db-results.txt', e.message);
        process.exit(1);
    }
}
check();
