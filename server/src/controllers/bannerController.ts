import bannerService from '../services/bannerService';
import asyncHandler from '../middleware/asyncHandler';

// @desc    Get all active banners
// @route   GET /api/banners
// @access  Public
export const getBanners = asyncHandler(async (req, res, next) => {
    const banners = await bannerService.getPublicBanners();
    res.status(200).json({ success: true, count: banners.length, data: banners });
});

// @desc    Admin get all banners
// @route   GET /api/banners/admin
// @access  Private/Admin
export const getAdminBanners = asyncHandler(async (req, res, next) => {
    const banners = await bannerService.getAdminBanners();
    res.status(200).json({ success: true, count: banners.length, data: banners });
});

// @desc    Create banner
// @route   POST /api/banners
// @access  Private/Admin
export const createBanner = asyncHandler(async (req, res, next) => {
    const banner = await bannerService.createBanner(req.body, req.file, req.user, req);
    res.status(201).json({ success: true, data: banner });
});

// @desc    Update banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
export const updateBanner = asyncHandler(async (req, res, next) => {
    const banner = await bannerService.updateBanner(req.params.id as string, req.body, req.file, req.user, req);
    res.status(200).json({ success: true, data: banner });
});

// @desc    Delete banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
export const deleteBanner = asyncHandler(async (req, res, next) => {
    await bannerService.deleteBanner(req.params.id as string, req.user, req);
    res.status(200).json({ success: true, data: {} });
});
