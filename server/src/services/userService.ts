import User from '../models/User';
import ErrorResponse from '../utils/errorResponse';
import advancedResults from '../utils/advancedResults';

class UserService {
    /**
     * Get all users with advanced results
     */
    async getAllUsers(reqQuery: any) {
        return await advancedResults(User as any, reqQuery);
    }

    /**
     * Get single user
     */
    async getUserById(id: string) {
        const user = await User.findById(id);
        if (!user) {
            throw new ErrorResponse(`User not found with id of ${id}`, 404);
        }
        return user;
    }

    /**
     * Update user (Admin)
     */
    async updateUser(id: string, updateData: any) {
        const user = await User.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });
        if (!user) {
            throw new ErrorResponse(`User not found with id of ${id}`, 404);
        }
        return user;
    }

    /**
     * Delete user
     */
    async deleteUser(id: string) {
        const user = await User.findById(id);
        if (!user) {
            throw new ErrorResponse(`User not found with id of ${id}`, 404);
        }
        await user.deleteOne();
        return true;
    }
}

export default new UserService();
