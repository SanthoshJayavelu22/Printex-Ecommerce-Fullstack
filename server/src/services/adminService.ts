import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';

/**
 * Service to handle Admin dashboard and statistical business logic.
 */
class AdminService {
    
    /**
     * Get dashboard statistics based on date range.
     */
    async getDashboardStats(range?: string, start?: string, end?: string) {
        let dateFilter: any = {};
        
        if (range && range !== 'all_time') {
            let startDate: Date | null = new Date();
            let endDate = new Date();

            if (range === 'this_week') {
                const day = startDate.getDay();
                const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
                startDate.setDate(diff);
                startDate.setHours(0,0,0,0);
            } else if (range === 'last_week') {
                const day = startDate.getDay();
                const diff = startDate.getDate() - day + (day === 0 ? -6 : 1) - 7;
                startDate.setDate(diff);
                startDate.setHours(0,0,0,0);
                
                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 6);
                endDate.setHours(23,59,59,999);
            } else if (range === 'this_month') {
                startDate.setDate(1);
                startDate.setHours(0,0,0,0);
            } else if (range === 'last_month') {
                startDate.setMonth(startDate.getMonth() - 1);
                startDate.setDate(1);
                startDate.setHours(0,0,0,0);

                endDate = new Date(startDate);
                endDate.setMonth(startDate.getMonth() + 1);
                endDate.setDate(0);
                endDate.setHours(23,59,59,999);
            } else if (range === 'custom' && start && end) {
                startDate = new Date(start as string);
                startDate.setHours(0,0,0,0);
                endDate = new Date(end as string);
                endDate.setHours(23,59,59,999);
            } else {
                startDate = null;
            }

            if (startDate) {
                dateFilter.createdAt = { $gte: startDate, $lte: endDate };
            }
        }

        const totalOrders = await Order.countDocuments(dateFilter);
        const totalProducts = await Product.countDocuments(); 
        const totalUsers = await User.countDocuments({ role: 'user', ...dateFilter });

        const revenueStats = await Order.aggregate([
            { $match: { orderStatus: { $ne: 'Cancelled' }, ...dateFilter } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        const totalRevenue = revenueStats.length > 0 ? revenueStats[0].total : 0;

        const recentOrders = await Order.find(dateFilter)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(10);

        return {
            totalOrders,
            totalProducts,
            totalUsers,
            totalRevenue,
            recentOrders
        };
    }

    /**
     * Get products with stock below threshold.
     */
    async getLowStockProducts(threshold: number = 10) {
        return await Product.find({ 
            stock: { $lt: threshold }
        }).select('name stock price');
    }
}

export default new AdminService();
