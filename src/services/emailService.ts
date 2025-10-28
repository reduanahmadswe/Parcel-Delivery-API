import nodemailer from 'nodemailer';
import { envVars } from '../config/env';
import { senderEmailTemplate, receiverEmailTemplate } from '../templates/emailTemplates';

interface SendResult {
    sender?: any;
    receiver?: any;
}

// Configure transporter using centralized environment variables
const transporter = nodemailer.createTransport({
    host: envVars.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(envVars.EMAIL_PORT || '587', 10),
    secure: envVars.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: envVars.EMAIL_USER,
        pass: envVars.EMAIL_PASSWORD,
    },
});

transporter.verify((error, success) => {
    if (error) {
        // do not throw here, just log - service may not be configured in all environments

        console.error('❌ Email service configuration error:', error);
    } else {

        console.info('✅ Email service is ready to send emails');
    }
});

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