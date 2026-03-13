"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBanner = exports.updateBanner = exports.createBanner = exports.getAdminBanners = exports.getBanners = void 0;
const Banner_1 = __importDefault(require("../models/Banner"));
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
const activityController_1 = require("./activityController");
// @desc    Get all banners
// @route   GET /api/banners
// @access  Public
exports.getBanners = (0, asyncHandler_1.default)(async (req, res, next) => {
    const banners = await Banner_1.default.find({ isActive: true }).sort('order');
    res.status(200).json({ success: true, count: banners.length, data: banners });
});
// @desc    Admin get all banners
// @route   GET /api/banners/admin
// @access  Private/Admin
exports.getAdminBanners = (0, asyncHandler_1.default)(async (req, res, next) => {
    const banners = await Banner_1.default.find().sort('order');
    res.status(200).json({ success: true, count: banners.length, data: banners });
});
// @desc    Create banner
// @route   POST /api/banners
// @access  Private/Admin
exports.createBanner = (0, asyncHandler_1.default)(async (req, res, next) => {
    if (req.file) {
        req.body.image = req.file.path.replace(/\\/g, '/');
    }
    // Convert string booleans if necessary (form-data sends everything as strings)
    if (req.body.isActive) {
        req.body.isActive = req.body.isActive === 'true';
    }
    const banner = await Banner_1.default.create(req.body);
    await (0, activityController_1.logActivity)(req.user.id, 'CREATE', 'BANNER', `Banner created: ${banner.title}`, req);
    res.status(201).json({ success: true, data: banner });
});
// @desc    Update banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
exports.updateBanner = (0, asyncHandler_1.default)(async (req, res, next) => {
    if (req.file) {
        req.body.image = req.file.path.replace(/\\/g, '/');
    }
    if (req.body.isActive) {
        req.body.isActive = req.body.isActive === 'true';
    }
    const banner = await Banner_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!banner)
        return next(new errorResponse_1.default('Banner not found', 404));
    await (0, activityController_1.logActivity)(req.user.id, 'UPDATE', 'BANNER', `Banner updated: ${banner.title}`, req);
    res.status(200).json({ success: true, data: banner });
});
// @desc    Delete banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
exports.deleteBanner = (0, asyncHandler_1.default)(async (req, res, next) => {
    const banner = await Banner_1.default.findById(req.params.id);
    if (!banner)
        return next(new errorResponse_1.default('Banner not found', 404));
    await banner.deleteOne();
    await (0, activityController_1.logActivity)(req.user.id, 'DELETE', 'BANNER', `Banner ID deleted: ${req.params.id}`, req);
    res.status(200).json({ success: true, data: {} });
});
//# sourceMappingURL=bannerController.js.map