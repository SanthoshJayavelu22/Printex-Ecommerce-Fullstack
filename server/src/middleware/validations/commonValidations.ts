import { Request, Response, NextFunction } from 'express';
import { validationResult, body } from 'express-validator';
import ErrorResponse from '../../utils/errorResponse';

export const validateResult = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const message = errors.array().map(err => err.msg).join(', ');
        return next(new ErrorResponse(message, 400));
    }
    next();
};

export const orderValidators = [
    body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('paymentMethod').notEmpty().withMessage('Payment method is required'),
    validateResult
];

export const productValidators = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('category').notEmpty().withMessage('Category is required'),
    validateResult
];
