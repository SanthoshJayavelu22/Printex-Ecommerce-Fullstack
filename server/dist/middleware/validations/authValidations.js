"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResetPassword = exports.validateLogin = exports.validateRegister = void 0;
const express_validator_1 = require("express-validator");
exports.validateRegister = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required').trim(),
    (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array().map(err => err.msg) });
        }
        next();
    }
];
exports.validateLogin = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array().map(err => err.msg) });
        }
        next();
    }
];
exports.validateResetPassword = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    (0, express_validator_1.body)('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
    (0, express_validator_1.body)('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array().map(err => err.msg) });
        }
        next();
    }
];
//# sourceMappingURL=authValidations.js.map