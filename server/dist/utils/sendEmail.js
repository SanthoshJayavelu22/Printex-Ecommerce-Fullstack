"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (options) => {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
        console.error('SMTP configuration is missing from .env. Email not sent.');
        return;
    }
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };
    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
};
exports.default = sendEmail;
//# sourceMappingURL=sendEmail.js.map