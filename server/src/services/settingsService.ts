import Settings from '../models/Settings';
import ErrorResponse from '../utils/errorResponse';
import activityService from './activityService';

class SettingsService {
    /**
     * Get site settings
     */
    async getSettings() {
        let settings = await Settings.findOne().lean();
        if (!settings) {
            settings = await Settings.create({});
        }
        return settings;
    }

    /**
     * Update site settings
     */
    async updateSettings(updateData: any, userId: string, req?: any) {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create(updateData || {});
        } else {
            settings = await Settings.findByIdAndUpdate(settings._id, updateData, {
                new: true,
                runValidators: true
            });
        }

        await activityService.logActivity(userId, 'UPDATE', 'SETTINGS', 'System settings updated', req);

        return settings;
    }
}

export default new SettingsService();
