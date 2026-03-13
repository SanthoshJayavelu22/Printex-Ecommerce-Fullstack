"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscribers = exports.subscribe = void 0;
const Subscriber_1 = __importDefault(require("../models/Subscriber"));
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
exports.subscribe = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return next(new errorResponse_1.default('Please provide an email', 400));
    }
    let subscriber = await Subscriber_1.default.findOne({ email });
    if (subscriber) {
        if (!subscriber.isActive) {
            subscriber.isActive = true;
            await subscriber.save();
        }
        return res.status(200).json({
            success: true,
            message: 'You are already subscribed'
        });
    }
    subscriber = await Subscriber_1.default.create({ email });
    res.status(201).json({
        success: true,
        data: subscriber,
        message: 'Successfully subscribed to newsletter'
    });
});
// @desc    Get all subscribers
// @route   GET /api/newsletter/subscribers
// @access  Private/Admin
exports.getSubscribers = (0, asyncHandler_1.default)(async (req, res, next) => {
    const subscribers = await Subscriber_1.default.find().sort('-createdAt');
    res.status(200).json({
        success: true,
        count: subscribers.length,
        data: subscribers
    });
});
//# sourceMappingURL=subscriberController.js.map