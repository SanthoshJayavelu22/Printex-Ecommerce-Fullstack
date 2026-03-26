import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import compression from 'compression';

import connectDB from './config/db';
import errorHandler from './middleware/errorMiddleware';

// Import models for seeding or types
import User from './models/User';

// Import Routes
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import categoryRoutes from './routes/categoryRoutes';
import adminRoutes from './routes/adminRoutes';
import couponRoutes from './routes/couponRoutes';
import userRoutes from './routes/userRoutes';
import reviewRoutes from './routes/reviewRoutes';
import paymentRoutes from './routes/paymentRoutes';
import contactRoutes from './routes/contactRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import newsletterRoutes from './routes/subscriberRoutes';

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Enable CORS
// CORS is handled in app.ts

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(mongoSanitize());
// @ts-ignore - hpp types can be tricky
app.use(hpp());
app.use(compression());
 
// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 500,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Serve static files (Accessed via /api/public/...)
app.use('/api/public', express.static(path.join(process.cwd(), 'public')));

app.get('/', (req: Request, res: Response) => {   
    res.send('Printix Labels API is running...');
});

// Global Error Handler  
app.use(errorHandler); 
    
const startServer = async () => {
    try {
        await connectDB();
        
        // Auto-seed admin
        const adminEmail = 'admin@printixlabels.com';
        let admin = await User.findOne({ email: adminEmail });
        if (!admin) {
            admin = new User({
                name: 'Super Admin',
                email: adminEmail,
                password: 'password123',
                role: 'super-admin'
            });
            await admin.save();
            console.log(`Super Admin seeded: ${adminEmail} | password123`);
        }

        const PORT = process.env.PORT || 5000;   
        const serverInstance = app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });

        // Handle server errors
        serverInstance.on('error', (err: any) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use.`);
            } else {
                console.error(`Server error: ${err.message}`);
            }
            process.exit(1);
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (err: any) => {
            console.log(`Error: ${err.message}`);
            serverInstance.close(() => process.exit(1));
        });

    } catch (err: any) {
        console.error('SERVER FATAL START ERROR:', err.message);
        process.exit(1);
    }
};

startServer();


