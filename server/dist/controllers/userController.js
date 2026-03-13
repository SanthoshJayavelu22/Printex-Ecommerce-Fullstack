"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = (0, asyncHandler_1.default)(async (req, res, next) => {
    const users = await User_1.default.find();
    res.status(200).json({
        success: true,
        count: users.length,
        data: users
    });
});
// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = (0, asyncHandler_1.default)(async (req, res, next) => {
    const user = await User_1.default.findById(req.params.id);
    if (!user) {
        return next(new errorResponse_1.default(`User not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        data: user
    });
});
// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = (0, asyncHandler_1.default)(async (req, res, next) => {
    const user = await User_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: user
    });
});
// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = (0, asyncHandler_1.default)(async (req, res, next) => {
    await User_1.default.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        data: {}
    });
});
//# sourceMappingURL=userController.js.map