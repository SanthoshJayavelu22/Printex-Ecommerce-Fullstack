import ActivityLog from '../models/ActivityLog';
import advancedResults from '../utils/advancedResults';

/**
 * Service to handle Activity Logging business logic
 */
class ActivityService {
    /**
     * Get activity logs with advanced results (filtering, pagination)
     */
    async getActivityLogs(reqQuery: any) {
        return await advancedResults(ActivityLog as any, reqQuery, {
            path: 'user',
            select: 'name email role'
        });
    }

    /**
     * Internal helper to log an activity
     */
    async logActivity(userId: string, action: string, module: string, details: string, req?: any) {
        try {
            await ActivityLog.create({
                user: userId,
                action,
                module,
                details,
                ipAddress: req?.ip,
                userAgent: req?.get('User-Agent')
            });
        } catch (err) {
            console.error('Activity Logging Error:', err);
        }
    }
}

export default new ActivityService();
