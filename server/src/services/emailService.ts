import sendEmail from '../utils/sendEmail';
const getBaseTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .header { background: #244441; padding: 40px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; letter-spacing: -1px; text-transform: uppercase; font-weight: 900; }
        .content { padding: 40px 30px; }
        .footer { background: #f1f5f9; padding: 30px; text-align: center; color: #64748b; font-size: 12px; }
        .button { display: inline-block; padding: 14px 32px; background: #244441; color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-top: 20px; transition: 0.3s; }
        .otp-box { background: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 16px; padding: 20px; text-align: center; margin: 20px 0; }
        .otp-code { font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #244441; margin: 0; }
        .order-id { color: #64748b; font-size: 14px; margin-bottom: 20px; }
        .info-grid { border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 20px; }
        .info-label { font-size: 12px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .info-value { font-size: 16px; font-weight: 600; color: #1e293b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header"><h1>PRINTIX LABELS</h1></div>
        <div class="content">${content}</div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Printix Labels. All rights reserved.</p>
            <p>Made for modern brands.</p>
        </div>
    </div>
</body>
</html>
`;

/**
 * Send welcome email to new users
 */
export const sendWelcomeEmail = async (user: any) => {
    const html = getBaseTemplate(`
        <h2 style="font-size: 24px; font-weight: 900; margin-bottom: 20px;">Welcome to the Elite, ${user.name}!</h2>
        <p>You've just joined the future of digital labeling. At <strong>Printix Labels</strong>, we blend precision engineering with premium aesthetics to help your brand stand out.</p>
        <p>Explore our library of premium materials, 3D finishes, and custom shapes designed to elevate your brand's presence.</p>
        <a href="https://printixlabels.com/product" class="button">Explore Collections</a>
    `);

    await sendEmail({
        email: user.email,
        subject: 'Welcome to Printix Labels Studio',
        message: `Welcome ${user.name}! Thank you for joining Printix Labels.`,
        html
    });
};

/**
 * Send order confirmation email
 */
export const sendOrderConfirmationEmail = async (user: any, order: any) => {
    const html = getBaseTemplate(`
        <h2 style="font-size: 24px; font-weight: 900; margin-bottom: 5px;">Order Received.</h2>
        <p class="order-id">REFERENCE: #${order._id.toString().toUpperCase()}</p>
        <p>Hello ${user.name}, your vision is now in production. We've successfully received your order and our artisans are beginning the micro-finishing process.</p>
        
        <div class="info-grid">
            <div style="margin-bottom: 15px;">
                <div class="info-label">Investment Amount</div>
                <div class="info-value">INR ${order.totalAmount.toLocaleString()}</div>
            </div>
            <div>
                <div class="info-label">Payment Mode</div>
                <div class="info-value">${order.paymentInfo.method}</div>
            </div>
        </div>
        
        <a href="https://printixlabels.com/orders/${order._id}" class="button">Track Your Craft</a>
    `);

    await sendEmail({
        email: user.email,
        subject: `Order Confirmation - #${order._id}`,
        message: `Your order #${order._id} has been placed successfully.`,
        html
    });
};

/**
 * Send order status update email
 */
export const sendOrderStatusEmail = async (user: any, order: any) => {
    let statusEmoji = '📦';
    let statusDescription = 'Your order is being processed.';
    
    if (order.orderStatus === 'Shipped') {
        statusEmoji = '🚚';
        statusDescription = 'Your creations have left our studio and are on their way to you.';
    } else if (order.orderStatus === 'Delivered') {
        statusEmoji = '✨';
        statusDescription = 'The wait is over. Your order has been delivered successfully.';
    } else if (order.orderStatus === 'Cancelled') {
        statusEmoji = '❌';
        statusDescription = 'Your order has been cancelled.';
    }

    let trackingBlock = '';
    if (order.orderStatus === 'Shipped' && order.deliveryTracking?.trackingNumber) {
        trackingBlock = `
            <div class="info-grid">
                <div style="margin-bottom: 15px;">
                    <div class="info-label">Carrier Partner</div>
                    <div class="info-value">${order.deliveryTracking.courierName}</div>
                </div>
                <div>
                    <div class="info-label">Tracking Identification</div>
                    <div class="info-value">${order.deliveryTracking.trackingNumber}</div>
                </div>
            </div>
        `;
    }

    const html = getBaseTemplate(`
        <h2 style="font-size: 24px; font-weight: 900; margin-bottom: 5px;">Movement Update.</h2>
        <p class="order-id">ORDER: #${order._id.toString().toUpperCase()}</p>
        <p>Hello ${user.name}, ${statusDescription}</p>
        
        <div style="background: #244441; color: white; padding: 20px; border-radius: 16px; margin: 20px 0; text-align: center;">
            <div style="font-size: 40px; margin-bottom: 5px;">${statusEmoji}</div>
            <div style="font-size: 14px; font-weight: 900; text-transform: uppercase;">Current Phase: ${order.orderStatus}</div>
        </div>

        ${trackingBlock}
        
        <a href="${order.deliveryTracking?.trackingUrl || 'https://printixlabels.com/orders/' + order._id}" class="button">View Progress</a>
    `);

    await sendEmail({
        email: user.email,
        subject: `${statusEmoji} Printix Labels | Order Update`,
        message: `Your order status has been updated to: ${order.orderStatus}.`,
        html
    });
};

/**
 * Send OTP for email verification
 */
export const sendOTPEmail = async (email: string, otp: string) => {
    const html = getBaseTemplate(`
        <h2 style="font-size: 24px; font-weight: 900; margin-bottom: 10px;">Security Verification.</h2>
        <p>To ensure it's really you, please enter the exclusive verification code below in your application.</p>
        
        <div class="otp-box">
            <div class="info-label" style="margin-bottom: 10px;">Secure Access Pin</div>
            <p class="otp-code">${otp}</p>
        </div>
        
        <p style="font-size: 13px; color: #94a3b8; text-align: center;">This code will expire in exactly 10 minutes to protect your session.</p>
    `);

    await sendEmail({
        email: email,
        subject: 'Your Printix Access Key',
        message: `Your OTP code is ${otp}.`,
        html
    });
};

export default {
    sendWelcomeEmail,
    sendOrderConfirmationEmail,
    sendOrderStatusEmail,
    sendOTPEmail
};
