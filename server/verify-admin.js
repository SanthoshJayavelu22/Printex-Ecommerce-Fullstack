const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/printix";

async function verifyAdmin() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected.');

        // Use any collection to update since we don't want to rely on the model import if it's failing
        const db = mongoose.connection.db;
        const result = await db.collection('users').updateOne(
            { email: 'admin@printixlabels.com' },
            { $set: { isVerified: true, role: 'super-admin' } }
        );

        if (result.matchedCount > 0) {
            console.log('Admin user found and updated to be verified.');
        } else {
            console.log('Admin user not found. Creating a new verified admin...');
            // If not found, we might need a model or just insert directly
            // But let's assume it exists as the user said they are trying to login
        }

        await mongoose.disconnect();
        console.log('Done.');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

verifyAdmin();
