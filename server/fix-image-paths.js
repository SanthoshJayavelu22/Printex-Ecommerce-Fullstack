const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/printix";

async function fixPaths() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected.');

        const Product = mongoose.connection.db.collection('products');
        const products = await Product.find({}).toArray();

        console.log(`Checking ${products.length} products...`);

        for (const product of products) {
            if (product.images && Array.isArray(product.images)) {
                const fixedImages = product.images.map(img => {
                    if (typeof img === 'string') {
                        // Normalize backslashes
                        let normalized = img.replace(/\\/g, '/');
                        // Find the start of the 'public/' folder
                        const publicIndex = normalized.indexOf('public/');
                        if (publicIndex !== -1) {
                            return normalized.substring(publicIndex);
                        }
                    }
                    return img;
                });

                // Check if any change actually happened
                const hasChanges = JSON.stringify(product.images) !== JSON.stringify(fixedImages);
                if (hasChanges) {
                    await Product.updateOne(
                        { _id: product._id },
                        { $set: { images: fixedImages } }
                    );
                    console.log(`Updated images for product: ${product.name}`);
                }
            }
        }

        console.log('Cleanup complete!');
        process.exit(0);
    } catch (err) {
        console.error('Error during cleanup:', err);
        process.exit(1);
    }
}

fixPaths();
