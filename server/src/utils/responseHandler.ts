import { Response } from 'express';

export const sendSuccess = (res: Response, data: any, statusCode: number = 200, message: string = 'Success') => {
    return res.status(statusCode).json({
        success: true,
        message,
        count: Array.isArray(data) ? data.length : undefined,
        data
    });
};

export const sendError = (res: Response, message: string, statusCode: number = 500) => {
    return res.status(statusCode).json({
        success: false,
        error: message
    });
};
