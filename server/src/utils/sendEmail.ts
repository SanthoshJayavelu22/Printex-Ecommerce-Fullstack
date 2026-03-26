import nodemailer from 'nodemailer';

interface EmailOptions {
    email: string;
    subject: string;
    message: string;
    html?: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
        console.error('SMTP configuration is missing from .env. Email not sent.');
        return;
    }
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    } as any);

    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    try {
        const info = await transporter.sendMail(message);
        console.log('[EMAIL] Message sent: %s', info.messageId);
    } catch (error: any) {
        console.error('[EMAIL] Delivery failed:', error.message);
        // Throw so the calling service knows it failed, but we log it gracefully
        throw error;
    }
};

export default sendEmail;
