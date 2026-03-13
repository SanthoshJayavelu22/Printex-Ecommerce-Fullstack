import userService from '../services/userService';
import asyncHandler from '../middleware/asyncHandler';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res, next) => {
    const results = await userService.getAllUsers(req.query);
    res.status(200).json(results);
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = asyncHandler(async (req, res, next) => {
    const user = await userService.getUserById(req.params.id as string);
    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res, next) => {
    const user = await userService.updateUser(req.params.id as string, req.body);
    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res, next) => {
    await userService.deleteUser(req.params.id as string);
    res.status(200).json({
        success: true,
        data: {}
    });
});
