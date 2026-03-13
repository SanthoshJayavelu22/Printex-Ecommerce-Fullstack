"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInquiry = exports.updateInquiry = exports.getInquiry = exports.getInquiries = exports.submitInquiry = void 0;
const Contact_1 = __importDefault(require("../models/Contact"));
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
// @desc    Submit contact inquiry
// @route   POST /api/contacts
// @access  Public
exports.submitInquiry = (0, asyncHandler_1.default)(async (req, res, next) => {
    const inquiry = await Contact_1.default.create(req.body);
    res.status(201).json({ success: true, data: inquiry });
});
// @desc    Get all inquiries
// @route   GET /api/contacts
// @access  Private/Admin
exports.getInquiries = (0, asyncHandler_1.default)(async (req, res, next) => {
    const inquiries = await Contact_1.default.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: inquiries.length, data: inquiries });
});
// @desc    Get single inquiry
// @route   GET /api/contacts/:id
// @access  Private/Admin
exports.getInquiry = (0, asyncHandler_1.default)(async (req, res, next) => {
    const inquiry = await Contact_1.default.findById(req.params.id);
    if (!inquiry)
        return next(new errorResponse_1.default('Inquiry not found', 404));
    // Mark as read when admin views it
    if (!inquiry.isRead) {
        inquiry.isRead = true;
        await inquiry.save();
    }
    res.status(200).json({ success: true, data: inquiry });
});
// @desc    Update inquiry status
// @route   PUT /api/contacts/:id
// @access  Private/Admin
exports.updateInquiry = (0, asyncHandler_1.default)(async (req, res, next) => {
    const inquiry = await Contact_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!inquiry)
        return next(new errorResponse_1.default('Inquiry not found', 404));
    res.status(200).json({ success: true, data: inquiry });
});
// @desc    Delete inquiry
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
exports.deleteInquiry = (0, asyncHandler_1.default)(async (req, res, next) => {
    const inquiry = await Contact_1.default.findById(req.params.id);
    if (!inquiry)
        return next(new errorResponse_1.default('Inquiry not found', 404));
    await inquiry.deleteOne();
    res.status(200).json({ success: true, data: {} });
});
//# sourceMappingURL=contactController.js.map