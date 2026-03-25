import https from 'https';

/**
 * Service to handle WhatsApp notifications using ChatMitra API
 */
class WhatsappService {
    private apiUrl: string;
    private apiToken: string;

    constructor() {
        this.apiUrl = process.env.WHATSAPP_API_URL || 'https://backend.chatmitra.com/developer/api/send_message';
        this.apiToken = process.env.WHATSAPP_API_TOKEN || '';
    }

    /**
     * Send a WhatsApp message using built-in https module
     * @param {string} phone - Recipient mobile number
     * @param {string} message - Message content
     * @returns {Promise<any>}
     */
    async sendMessage(phone: string, message: string) {
        if (!this.apiToken) {
            console.warn('WhatsApp API Token is not configured. Skipping message.');
            return null;
        }

        // Clean phone number: remove +, spaces, etc.
        const cleanPhone = phone.replace(/\D/g, '');
        
        // Ensure it has a country code (assuming 91 for India if not specified and length is 10)
        let finalPhone = cleanPhone;
        if (cleanPhone.length === 10) {
            finalPhone = '91' + cleanPhone;
        }

        const data = JSON.stringify({
            recipient_mobile_number: finalPhone,
            message: message
        });

        const url = new URL(this.apiUrl);
        const options = {
            hostname: url.hostname,
            path: url.pathname,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiToken}`,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let body = '';
                res.on('data', (chunk) => body += chunk);
                res.on('end', () => {
                    if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                        try {
                            resolve(JSON.parse(body));
                        } catch (e) {
                            resolve(body);
                        }
                    } else {
                        console.error('WhatsApp API Error Response:', body);
                        reject(new Error(`WhatsApp API request failed with status ${res.statusCode}`));
                    }
                });
            });

            req.on('error', (error) => {
                console.error('WhatsApp API Connection Error:', error.message);
                reject(error);
            });

            req.write(data);
            req.end();
        });
    }

    /**
     * Send order confirmation WhatsApp message
     * @param {any} user - User object
     * @param {any} order - Order object
     */
    async sendOrderConfirmation(user: any, order: any) {
        const phone = user.phoneNumber;
        if (!phone) return;

        const message = 
`*ORDER CONFIRMED* 🛍️

Hello ${user.name},

Your vision is now in production! We've received your order *#${order._id.toString().toUpperCase().slice(-8)}*.

*Investment:* INR ${order.totalAmount.toLocaleString()}
*Payment:* ${order.paymentInfo.method}

Our team is now beginning the precision-printing process. You can track your craft here:
https://printixlabels.com/orders/${order._id}

Thank you for choosing *Printix Labels Studio*. ✨`;

        return this.sendMessage(phone, message).catch(err => {
            console.error('Failed to send WhatsApp confirmation:', err.message);
        });
    }

    /**
     * Send order status update WhatsApp message
     * @param {any} user - User object
     * @param {any} order - Order object
     */
    async sendOrderStatusUpdate(user: any, order: any) {
        const phone = user.phoneNumber;
        if (!phone) return;

        let statusEmoji = '📦';
        let progressText = 'is being processed';
        
        if (order.orderStatus === 'Shipped') {
            statusEmoji = '🚚';
            progressText = 'has been dispatched';
        } else if (order.orderStatus === 'Delivered') {
            statusEmoji = '🎉';
            progressText = 'has been delivered';
        } else if (order.orderStatus === 'Cancelled') {
            statusEmoji = '❌';
            progressText = 'has been cancelled';
        }

        let message = 
`*MOVEMENT UPDATE* ${statusEmoji}

Hello ${user.name},

Your order *#${order._id.toString().toUpperCase().slice(-8)}* ${progressText}.

*Current Phase:* ${order.orderStatus.toUpperCase()}`;

        if (order.orderStatus === 'Shipped' && order.deliveryTracking?.trackingNumber) {
            message += `\n\n*Partner:* ${order.deliveryTracking.courierName}\n*Tracking ID:* ${order.deliveryTracking.trackingNumber}`;
            if (order.deliveryTracking.trackingUrl) {
                message += `\n*Link:* ${order.deliveryTracking.trackingUrl}`;
            }
        }

        message += `\n\nView Progress: https://printixlabels.com/orders/${order._id}\n\nThank you for trusting *Printix Labels*.`;

        return this.sendMessage(phone, message).catch(err => {
            console.error('Failed to send WhatsApp status update:', err.message);
        });
    }

    /**
     * Send welcome WhatsApp message
     * @param {any} user - User object
     */
    async sendWelcomeMessage(user: any) {
        const phone = user.phoneNumber;
        if (!phone) return;

        const message = 
`*ESTABLISHED* 🎨✨

Welcome to the collective, ${user.name}!

You've joined *Printix Labels Studio*. We specialize in premium digital printing and high-end label solutions for the modern brand.

*What's Next?*
- Explore our Gallery
- Choose your Materials
- Elevate your Packaging

Start Creating: https://printixlabels.com/product

Best Regards,
*Team Printix*`;

        return this.sendMessage(phone, message).catch(err => {
            console.error('Failed to send WhatsApp welcome message:', err.message);
        });
    }

    /**
     * Send OTP WhatsApp message
     * @param {string} phone - Recipient mobile number
     * @param {string} otp - OTP code
     */
    async sendOTP(phone: string, otp: string) {
        if (!phone) return;

        const message = 
`*SECURITY ACCESS* 🔒

Your exclusive verification code for *Printix Labels* is:

*${otp}*

This code will expire in 10 minutes. For your security, do not share this access key with anyone.`;

        return this.sendMessage(phone, message).catch(err => {
            console.error('Failed to send WhatsApp OTP:', err.message);
        });
    }
}

export default new WhatsappService();
