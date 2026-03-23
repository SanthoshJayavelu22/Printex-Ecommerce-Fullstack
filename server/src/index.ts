import express, { Request, Response, NextFunction } from 'express';
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

// Connect to database
connectDB().then(async () => {
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
});

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "https://printixlabels.com",
  "https://www.printixlabels.com",
  "http://printixlabels.com",
  "http://www.printixlabels.com",
  

];

const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    // Also check for common domain variations or allow all in dev if needed
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes(origin + '/') || (origin && origin.includes('printixlabels.com'))) {
      callback(null, true);
    } else {
      console.warn(`Origin rejected by CORS: ${origin}`);
      callback(null, true); // Temporarily allow all while debugging if preferred, but let's just make it match
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

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

// Serve static files
app.use('/public', express.static('public'));

app.get('/', (req: Request, res: Response) => {   
    res.send('Printix Labels API is running...');
});

// Global Error Handler  
app.use(errorHandler); 
    
const PORT = process.env.PORT || 5000;   

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
process.on('unhandledRejection', (err: any, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});