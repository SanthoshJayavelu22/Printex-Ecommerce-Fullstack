const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

async function check() {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db();
        const productsCount = await db.collection('products').countDocuments();
        const categoriesCount = await db.collection('categories').countDocuments();
        const prods = await db.collection('products').find({}).limit(3).toArray();
        const cats = await db.collection('categories').find({}).limit(10).toArray();
        
        const res = {
            counts: { products: productsCount, categories: categoriesCount },
            sampleProds: prods.map(p => ({ n: p.name, s: p.slug, c: p.categories })),
            sampleCats: cats.map(c => ({ n: c.name, s: c.slug, id: c._id }))
        };
        
        require('fs').writeFileSync('final-results.json', JSON.stringify(res, null, 2));
        process.exit(0);
    } catch(e) {
        require('fs').writeFileSync('final-results.json', 'ERROR: ' + e.message);
        process.exit(1);
    }
}
check();
