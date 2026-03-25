import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';

import errorHandler from './middleware/errorMiddleware';
import routes from './routes';

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
const corsOptions: cors.CorsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'Expires']
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

// Serve static files
app.use('/public', express.static(path.join(__dirname, '../public')));

// Mount routers
app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
    res.send('Printix Labels API is running...');
});

// Global Error Handler
app.use(errorHandler);

export default app;
