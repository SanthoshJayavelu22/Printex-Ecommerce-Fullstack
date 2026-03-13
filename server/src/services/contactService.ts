import Contact from '../models/Contact';
import ErrorResponse from '../utils/errorResponse';
import advancedResults from '../utils/advancedResults';

class ContactService {
    /**
     * Submit contact inquiry
     */
    async submitInquiry(data: any) {
        return await Contact.create(data);
    }

    /**
     * Get all inquiries with advanced results
     */
    async getAllInquiries(reqQuery: any) {
        return await advancedResults(Contact as any, reqQuery);
    }

    /**
     * Get single inquiry and mark as read
     */
    async getInquiryById(id: string) {
        const inquiry = await Contact.findById(id);
        if (!inquiry) {
            throw new ErrorResponse('Inquiry not found', 404);
        }
        
        if (!inquiry.isRead) {
            inquiry.isRead = true;
            await inquiry.save();
        }

        return inquiry;
    }

    /**
     * Update inquiry
     */
    async updateInquiry(id: string, data: any) {
        const inquiry = await Contact.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        });
        if (!inquiry) {
            throw new ErrorResponse('Inquiry not found', 404);
        }
        return inquiry;
    }

    /**
     * Delete inquiry
     */
    async deleteInquiry(id: string) {
        const inquiry = await Contact.findById(id);
        if (!inquiry) {
            throw new ErrorResponse('Inquiry not found', 404);
        }
        await inquiry.deleteOne();
        return true;
    }
}

export default new ContactService();
