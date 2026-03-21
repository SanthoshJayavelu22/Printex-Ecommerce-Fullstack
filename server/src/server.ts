import app from './app';
import connectDB from './config/db';
import User from './models/User';

const PORT = process.env.PORT || 5000;

// Connect to database and start server
const startServer = async () => {
    try {
        await connectDB();
        
        // Seed Admin if not exists
        await seedAdmin();

        const server = app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });

        // Handle server errors
        server.on('error', (err: any) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use. Please kill the process or use a different port.`);
            } else {
                console.error(`Server error: ${err.message}`);
            }
            process.exit(1);
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (err: any) => {
            console.error(`Unhandled Rejection: ${err.message}`);
            // Close server & exit process
            server.close(() => process.exit(1));
        });

    } catch (error) {
        console.error(`Error connecting to database: ${error}`);
        process.exit(1);
    }
};

const seedAdmin = async () => {
    try {
        let admin = await User.findOne({ email: 'admin@printixlabels.com' });
        if (!admin) {
            admin = new User({
                name: 'Super Admin',
                email: 'admin@printixlabels.com',
                password: 'password123',
                role: 'super-admin'
            });
            await admin.save();
            console.log("Super Admin seeded: admin@printixlabels.com | password123");
        } else if (admin.role !== 'super-admin') {
            admin.role = 'super-admin';
            admin.password = 'password123';
            await admin.save();
            console.log("Super Admin updated: admin@printixlabels.com | password123");
        }
    } catch (e) {
        console.error("Auto admin creation failed", e);
    }
}

startServer();
