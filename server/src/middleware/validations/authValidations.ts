import { body, validationResult } from 'express-validator';

export const validateRegister = [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array().map(err => err.msg) });
        }
        next();
    }
];

export const validateLogin = [
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array().map(err => err.msg) });
        }
        next();
    }
];

export const validateResetPassword = [
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array().map(err => err.msg) });
        }
        next();
    }
];
