const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

async function fullDebug() {
    const log = (msg) => {
        console.log(msg);
        fs.appendFileSync('db-log.txt', msg + '\n');
    };
    
    try {
        fs.writeFileSync('db-log.txt', 'DEBUG START\n');
        await mongoose.connect(process.env.MONGO_URI);
        log('CONNECTED');
        
        const cats = await mongoose.connection.db.collection('categories').find({}).toArray();
        log(`CATEGORIES: ${cats.length}`);
        cats.forEach(c => log(`  CAT: ${c.name} | SLUG: ${c.slug} | ID: ${c._id}`));
        
        const prods = await mongoose.connection.db.collection('products').find({}).toArray();
        log(`PRODUCTS: ${prods.length}`);
        prods.forEach(p => log(`  PROD: ${p.name} | CAT_IDS: ${p.categories.map(String).join(',')}`));
        
        process.exit();
    } catch(e) {
        log('ERROR: ' + e.message);
        process.exit(1);
    }
}
fullDebug();
