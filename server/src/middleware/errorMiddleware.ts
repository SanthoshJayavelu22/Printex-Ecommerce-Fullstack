import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let error = { ...err };

    // Standard properties are NOT enumerable, so spread doesn't copy them
    error.message = err.message;
    error.statusCode = err.statusCode || 500;

    // Log to console for dev
    if (process.env.NODE_ENV !== 'test') {
        console.error(`[Error] ${err.name}: ${err.message}`);
        if (err.stack) console.error(err.stack);
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val: any) => val.message).join(', ');
        error = new ErrorResponse(message, 400);
    }

    // JWT Errors
    if (err.name === 'JsonWebTokenError') {
        error = new ErrorResponse('Not authorized to access this route', 401);
    }

    if (err.name === 'TokenExpiredError') {
        error = new ErrorResponse('Session expired, please login again', 401);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

export default errorHandler;
