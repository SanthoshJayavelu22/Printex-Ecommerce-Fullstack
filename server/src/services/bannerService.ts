import Banner from '../models/Banner';
import ErrorResponse from '../utils/errorResponse';
import activityService from './activityService';

class BannerService {
    /**
     * Get active banners for public view
     */
    async getPublicBanners() {
        return await Banner.find({ isActive: true }).sort('order').lean();
    }

    /**
     * Get all banners for admin view
     */
    async getAdminBanners() {
        return await Banner.find().sort('order').lean();
    }

    /**
     * Create a new banner
     */
    async createBanner(bannerData: any, file: any, user: any, req?: any) {
        if (file) {
            bannerData.image = file.path.replace(/\\/g, '/');
        }

        // Handle string booleans from multipart form
        if (bannerData.isActive !== undefined) {
            bannerData.isActive = bannerData.isActive === 'true' || bannerData.isActive === true;
        }

        const banner = await Banner.create(bannerData);

        await activityService.logActivity(
            user.id, 
            'CREATE', 
            'BANNER', 
            `Banner created: ${banner.title}`, 
            req
        );

        return banner;
    }

    /**
     * Update an existing banner
     */
    async updateBanner(id: string, bannerData: any, file: any, user: any, req?: any) {
        if (file) {
            bannerData.image = file.path.replace(/\\/g, '/');
        }

        if (bannerData.isActive !== undefined) {
            bannerData.isActive = bannerData.isActive === 'true' || bannerData.isActive === true;
        }

        const banner = await Banner.findByIdAndUpdate(id, bannerData, {
            new: true,
            runValidators: true
        });

        if (!banner) {
            throw new ErrorResponse('Banner not found', 404);
        }

        await activityService.logActivity(
            user.id, 
            'UPDATE', 
            'BANNER', 
            `Banner updated: ${banner.title}`, 
            req
        );

        return banner;
    }

    /**
     * Delete a banner
     */
    async deleteBanner(id: string, user: any, req?: any) {
        const banner = await Banner.findById(id);
        if (!banner) {
            throw new ErrorResponse('Banner not found', 404);
        }

        await banner.deleteOne();

        await activityService.logActivity(
            user.id, 
            'DELETE', 
            'BANNER', 
            `Banner ID deleted: ${id}`, 
            req
        );

        return true;
    }
}

export default new BannerService();
