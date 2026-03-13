"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// Protect routes
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
    try {
        // Verify token
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined');
        }
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        const user = await User_1.default.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, message: 'User no longer exists' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
    }
};
exports.protect = protect;
// Grant access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user?.role || 'unknown'} is not authorized to access this route`
            });
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=authMiddleware.js.map