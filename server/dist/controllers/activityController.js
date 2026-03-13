"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logActivity = exports.getActivityLogs = void 0;
const ActivityLog_1 = __importDefault(require("../models/ActivityLog"));
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
// @desc    Get all activity logs
// @route   GET /api/activities
// @access  Private/Admin
exports.getActivityLogs = (0, asyncHandler_1.default)(async (req, res, next) => {
    const logs = await ActivityLog_1.default.find()
        .populate('user', 'name email role')
        .sort('-createdAt')
        .limit(100);
    res.status(200).json({
        success: true,
        count: logs.length,
        data: logs
    });
});
// Helper function to log activity (not an exported route)
const logActivity = async (userId, action, module, details, req) => {
    try {
        await ActivityLog_1.default.create({
            user: userId,
            action,
            module,
            details,
            ipAddress: req?.ip,
            userAgent: req?.get('User-Agent')
        });
    }
    catch (err) {
        console.error('Activity Logging Error:', err);
    }
};
exports.logActivity = logActivity;
//# sourceMappingURL=activityController.js.map