const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

async function list() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const categories = await mongoose.connection.db.collection('categories').find({}).toArray();
        console.log('Categories Slots:', categories.map(c => ({ name: c.name, slug: c.slug })));
        process.exit();
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
list();
