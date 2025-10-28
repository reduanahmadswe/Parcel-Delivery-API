import nodemailer from 'nodemailer';
import { envVars } from '../config/env';
import { senderEmailTemplate, receiverEmailTemplate } from '../templates/emailTemplates';

interface SendResult {
    sender?: any;
    receiver?: any;
}

// Check if email is configured
const isEmailConfigured = !!(
    envVars.EMAIL_USER &&
    envVars.EMAIL_PASSWORD &&
    envVars.EMAIL_HOST
);

// Configure transporter using centralized environment variables
const transporter = isEmailConfigured
    ? nodemailer.createTransport({
        host: envVars.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(envVars.EMAIL_PORT || '587', 10),
        secure: envVars.EMAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: envVars.EMAIL_USER,
            pass: envVars.EMAIL_PASSWORD,
        },
        // Increased timeouts for better compatibility with Render
        connectionTimeout: 30000, // 30 seconds
        greetingTimeout: 30000,
        socketTimeout: 30000,
        // Additional Gmail-specific settings
        tls: {
            rejectUnauthorized: false, // Allow self-signed certificates
            ciphers: 'SSLv3'
        },
        debug: process.env.NODE_ENV === 'development', // Enable debug in dev
    })
    : null;

// Verify transporter without blocking server startup
if (transporter && isEmailConfigured) {
    // Run verification asynchronously without blocking
    transporter.verify((error, success) => {
        if (error) {
            console.warn('⚠️  Email service not available:', error.message);
            console.warn('📧 Emails will not be sent. Configure EMAIL_* environment variables to enable email notifications.');
        } else {
            console.info('✅ Email service is ready to send emails');
        }
    });
} else {
    console.warn('⚠️  Email service not configured');
    console.warn('📧 Set EMAIL_HOST, EMAIL_USER, and EMAIL_PASSWORD to enable email notifications.');
}

export const sendParcelNotificationEmails = async (parcelData: any): Promise<SendResult> => {
    const {
        trackingId,
        senderName,
        senderEmail,
        receiverName,
        receiverEmail,
        receiverAddress,
        parcelDetails,
    } = parcelData || {};

    const results: SendResult = {};

    // Check if email is configured
    if (!transporter || !isEmailConfigured) {
        console.warn('⚠️  Email not sent - service not configured');
        results.sender = { error: 'Email service not configured' };
        results.receiver = { error: 'Email service not configured' };
        return results;
    }

    const fromAddress = `${envVars.EMAIL_FROM_NAME || 'Parcel Delivery System'} <${envVars.EMAIL_FROM || envVars.EMAIL_USER}>`;
    const trackingUrl = `${envVars.FRONTEND_URL || 'http://localhost:5173'}/track?id=${trackingId}`;

    // Prepare template data
    const templateData = {
        trackingId,
        senderName,
        senderEmail,
        receiverName,
        receiverEmail,
        receiverAddress,
        parcelDetails,
        trackingUrl,
    };

    // Sender email with beautiful template
    if (senderEmail) {
        const senderMailOptions = {
            from: fromAddress,
            to: senderEmail,
            subject: `✅ আপনার পার্সেল সফলভাবে পাঠানো হয়েছে - ${trackingId}`,
            html: senderEmailTemplate(templateData),
        };

        try {
            const info = await transporter.sendMail(senderMailOptions as any);
            results.sender = info;
            console.info('✅ Sender email sent:', info.messageId || info);
        } catch (error: any) {
            console.error('❌ Sender email error:', error?.message || error);
            results.sender = { error: error?.message || String(error) };
        }
    }

    // Receiver email with beautiful template
    if (receiverEmail) {
        const receiverMailOptions = {
            from: fromAddress,
            to: receiverEmail,
            subject: `📦 আপনার জন্য একটি পার্সেল আসছে - ${trackingId}`,
            html: receiverEmailTemplate(templateData),
        };

        try {
            const info = await transporter.sendMail(receiverMailOptions as any);
            results.receiver = info;
            console.info('✅ Receiver email sent:', info.messageId || info);
        } catch (error: any) {
            console.error('❌ Receiver email error:', error?.message || error);
            results.receiver = { error: error?.message || String(error) };
        }
    }

    return results;
};

export default { sendParcelNotificationEmails };