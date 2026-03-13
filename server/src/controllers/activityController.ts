import activityService from '../services/activityService';
import asyncHandler from '../middleware/asyncHandler';

// @desc    Get all activity logs
// @route   GET /api/activities
// @access  Private/Admin
export const getActivityLogs = asyncHandler(async (req, res, next) => {
    const results = await activityService.getActivityLogs(req.query);
    res.status(200).json(results);
});

/**
 * Helper function to log activity (not an exported route)
 * Keeping it here or importing from service for backward compatibility 
 * if other controllers still import it from here.
 */
export const logActivity = activityService.logActivity;
