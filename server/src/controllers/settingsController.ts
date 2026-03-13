import settingsService from '../services/settingsService';
import asyncHandler from '../middleware/asyncHandler';

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
export const getSettings = asyncHandler(async (req, res, next) => {
    const settings = await settingsService.getSettings();
    res.status(200).json({ success: true, data: settings });
});

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = asyncHandler(async (req, res, next) => {
    const settings = await settingsService.updateSettings(req.body, req.user.id, req);
    res.status(200).json({ success: true, data: settings });
});
