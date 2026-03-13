import Subscriber from '../models/Subscriber';
import ErrorResponse from '../utils/errorResponse';
import advancedResults from '../utils/advancedResults';

class SubscriberService {
    /**
     * Subscribe to newsletter
     */
    async subscribe(email: string) {
        if (!email) {
            throw new ErrorResponse('Please provide an email', 400);
        }

        let subscriber = await Subscriber.findOne({ email });

        if (subscriber) {
            if (!subscriber.isActive) {
                subscriber.isActive = true;
                await subscriber.save();
                return { 
                    subscriber, 
                    message: 'Successfully re-subscribed to newsletter' 
                };
            }
            return { 
                subscriber, 
                message: 'You are already subscribed' 
            };
        }

        subscriber = await Subscriber.create({ email });
        return { 
            subscriber, 
            message: 'Successfully subscribed to newsletter' 
        };
    }

    /**
     * Get all subscribers with advanced results
     */
    async getAllSubscribers(reqQuery: any) {
        return await advancedResults(Subscriber as any, reqQuery);
    }
}

export default new SubscriberService();
