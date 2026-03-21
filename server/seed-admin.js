const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/printix_labels?retryWrites=true&w=majority")
.then(async () => {
    let admin = await User.findOne({ email: 'admin@printixlabels.com' });
    if (!admin) {
        admin = new User({
            name: 'Super Admin',
            email: 'admin@printixlabels.com',
            password: 'password123',
            role: 'super-admin'
        });
        await admin.save();
        console.log("Admin created: admin@printixlabels.com | password123");
    } else {
        admin.role = 'super-admin';
        await admin.save();
        console.log("Admin updated: admin@printixlabels.com | password123");
    }
    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});
