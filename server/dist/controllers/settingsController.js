"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = exports.getSettings = void 0;
const Settings_1 = __importDefault(require("../models/Settings"));
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const activityController_1 = require("./activityController");
// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = (0, asyncHandler_1.default)(async (req, res, next) => {
    let settings = await Settings_1.default.findOne();
    if (!settings) {
        settings = await Settings_1.default.create({});
    }
    res.status(200).json({ success: true, data: settings });
});
// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private/Admin
exports.updateSettings = (0, asyncHandler_1.default)(async (req, res, next) => {
    let settings = await Settings_1.default.findOne();
    if (!settings) {
        settings = await Settings_1.default.create(req.body || {});
    }
    else {
        settings = await Settings_1.default.findByIdAndUpdate(settings._id, req.body, {
            new: true,
            runValidators: true
        });
    }
    await (0, activityController_1.logActivity)(req.user.id, 'UPDATE', 'SETTINGS', 'System settings updated', req);
    res.status(200).json({ success: true, data: settings });
});
//# sourceMappingURL=settingsController.js.map