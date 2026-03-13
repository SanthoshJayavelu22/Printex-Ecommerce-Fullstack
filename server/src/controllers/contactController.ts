import contactService from '../services/contactService';
import asyncHandler from '../middleware/asyncHandler';

// @desc    Submit contact inquiry
// @route   POST /api/contacts
// @access  Public
export const submitInquiry = asyncHandler(async (req, res, next) => {
    const inquiry = await contactService.submitInquiry(req.body);
    res.status(201).json({ success: true, data: inquiry });
});

// @desc    Get all inquiries
// @route   GET /api/contacts
// @access  Private/Admin
export const getInquiries = asyncHandler(async (req, res, next) => {
    const results = await contactService.getAllInquiries(req.query);
    res.status(200).json(results);
});

// @desc    Get single inquiry
// @route   GET /api/contacts/:id
// @access  Private/Admin
export const getInquiry = asyncHandler(async (req, res, next) => {
    const inquiry = await contactService.getInquiryById(req.params.id as string);
    res.status(200).json({ success: true, data: inquiry });
});

// @desc    Update inquiry status
// @route   PUT /api/contacts/:id
// @access  Private/Admin
export const updateInquiry = asyncHandler(async (req, res, next) => {
    const inquiry = await contactService.updateInquiry(req.params.id as string, req.body);
    res.status(200).json({ success: true, data: inquiry });
});

// @desc    Delete inquiry
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
export const deleteInquiry = asyncHandler(async (req, res, next) => {
    await contactService.deleteInquiry(req.params.id as string);
    res.status(200).json({ success: true, data: {} });
});
