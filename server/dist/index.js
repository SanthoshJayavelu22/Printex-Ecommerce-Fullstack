"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const hpp_1 = __importDefault(require("hpp"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const compression_1 = __importDefault(require("compression"));
const db_1 = __importDefault(require("./config/db"));
const errorMiddleware_1 = __importDefault(require("./middleware/errorMiddleware"));
// Import models for seeding or types
const User_1 = __importDefault(require("./models/User"));
// Import Routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const couponRoutes_1 = __importDefault(require("./routes/couponRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const bannerRoutes_1 = __importDefault(require("./routes/bannerRoutes"));
const settingsRoutes_1 = __importDefault(require("./routes/settingsRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const wishlistRoutes_1 = __importDefault(require("./routes/wishlistRoutes"));
const subscriberRoutes_1 = __importDefault(require("./routes/subscriberRoutes"));
const activityRoutes_1 = __importDefault(require("./routes/activityRoutes"));
// Load env vars
dotenv_1.default.config();
// Connect to database
(0, db_1.default)().then(async () => {
    try {
        let admin = await User_1.default.findOne({ email: 'admin@tridevecommerce.com' });
        if (!admin) {
            admin = new User_1.default({
                name: 'Super Admin',
                email: 'admin@tridevecommerce.com',
                password: 'password123',
                role: 'super-admin'
            });
            await admin.save();
            console.log("Super Admin seeded: admin@tridevecommerce.com | password123");
        }
        else if (admin.role !== 'super-admin') {
            admin.role = 'super-admin';
            admin.password = 'password123';
            await admin.save();
            console.log("Super Admin updated: admin@tridevecommerce.com | password123");
        }
    }
    catch (e) {
        console.error("Auto admin creation failed", e);
    }
});
const app = (0, express_1.default)();
// Body parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Enable CORS
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://givingisdivine.com",
    "https://www.givingisdivine.com"
];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
// Security Middlewares
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use((0, express_mongo_sanitize_1.default)());
// @ts-ignore - hpp types can be tricky
app.use((0, hpp_1.default)());
app.use((0, compression_1.default)());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    max: 500,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);
// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// Mount routers
app.use('/api/auth', authRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/cart', cartRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
app.use('/api/categories', categoryRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/coupons', couponRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/reviews', reviewRoutes_1.default);
app.use('/api/payment', paymentRoutes_1.default);
app.use('/api/banners', bannerRoutes_1.default);
app.use('/api/settings', settingsRoutes_1.default);
app.use('/api/contacts', contactRoutes_1.default);
app.use('/api/wishlist', wishlistRoutes_1.default);
app.use('/api/newsletter', subscriberRoutes_1.default);
app.use('/api/activities', activityRoutes_1.default);
// Serve static files
app.use('/public', express_1.default.static('public'));
app.get('/', (req, res) => {
    res.send('Tridev Ecommerce API is running...');
});
// Global Error Handler  
app.use(errorMiddleware_1.default);
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
// Handle server errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please kill the process or use a different port.`);
    }
    else {
        console.error(`Server error: ${err.message}`);
    }
    process.exit(1);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
//# sourceMappingURL=index.js.map