import subscriberService from '../services/subscriberService';
import asyncHandler from '../middleware/asyncHandler';

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
export const subscribe = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const { subscriber, message } = await subscriberService.subscribe(email);

    res.status(200).json({
        success: true,
        data: subscriber,
        message
    });
});

// @desc    Get all subscribers
// @route   GET /api/newsletter/subscribers
// @access  Private/Admin
export const getSubscribers = asyncHandler(async (req, res, next) => {
    const results = await subscriberService.getAllSubscribers(req.query);
    res.status(200).json(results);
});
