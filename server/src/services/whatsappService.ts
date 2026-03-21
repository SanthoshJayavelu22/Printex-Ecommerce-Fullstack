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
        if (!phone) {
            console.warn(`User ${user.name} does not have a phone number. Cannot send WhatsApp.`);
            return;
        }

        const message = `Hello ${user.name}! 🛍️\n\nYour order #${order._id.toString().slice(-8).toUpperCase()} has been placed successfully at Printix Labels.\n\nTotal Amount: ₹${order.totalAmount.toLocaleString()}\nStatus: ${order.paymentInfo.status}\n\nThank you for shopping with us! ✨`;

        return this.sendMessage(phone, message).catch(err => {
            console.error('Failed to send WhatsApp confirmation:', err.message);
        });
    }
}

export default new WhatsappService();
