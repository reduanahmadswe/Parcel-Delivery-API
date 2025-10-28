import nodemailer from 'nodemailer';
import { envVars } from '../config/env';

import { generateParcelPDF } from './pdfService';
import { receiverEmailTemplate, senderEmailTemplate } from '../templates/emailTemplates';

interface SendResult {
    sender?: any;
    receiver?: any;
}

interface ParcelNotificationData {
    trackingId: string;
    senderName: string;
    senderEmail: string;
    senderPhone: string;
    receiverName: string;
    receiverEmail: string;
    receiverPhone: string;
    receiverAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    parcelDetails: {
        type: string;
        weight: number;
        dimensions?: {
            length: number;
            width: number;
            height: number;
        };
        description: string;
    };
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

export const sendParcelNotificationEmails = async (parcelData: ParcelNotificationData): Promise<SendResult> => {
    const {
        trackingId,
        senderName,
        senderEmail,
        senderPhone,
        receiverName,
        receiverEmail,
        receiverPhone,
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

    const fromAddress = `${envVars.EMAIL_FROM_NAME || 'ParcelTrack'} <${envVars.EMAIL_FROM || envVars.EMAIL_USER}>`;
    const trackingUrl = `${envVars.APP_URL || envVars.FRONTEND_URL || 'http://localhost:5173'}/track?id=${trackingId}`;

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

    // Generate PDF attachment
    let pdfBuffer: Buffer | null = null;
    try {
        pdfBuffer = await generateParcelPDF({
            trackingId,
            senderInfo: {
                name: senderName,
                email: senderEmail,
                phone: senderPhone,
            },
            receiverInfo: {
                name: receiverName,
                email: receiverEmail,
                phone: receiverPhone,
                address: receiverAddress,
            },
            parcelDetails,
        });
        console.info('✅ PDF generated successfully');
    } catch (pdfError: any) {
        console.error('❌ PDF generation error:', pdfError?.message || pdfError);
        // Continue sending emails without PDF if generation fails
    }

    // Prepare attachment if PDF was generated
    const attachments = pdfBuffer
        ? [
            {
                filename: `Parcel_${trackingId}.pdf`,
                content: pdfBuffer,
                contentType: 'application/pdf',
            },
        ]
        : [];

    // Sender email with PDF attachment
    if (senderEmail) {
        const senderMailOptions = {
            from: fromAddress,
            to: senderEmail,
            subject: `Parcel Created Successfully - Tracking ID: ${trackingId}`,
            html: senderEmailTemplate(templateData),
            attachments,
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

    // Receiver email with PDF attachment
    if (receiverEmail) {
        const receiverMailOptions = {
            from: fromAddress,
            to: receiverEmail,
            subject: `You have a new parcel - Tracking ID: ${trackingId}`,
            html: receiverEmailTemplate(templateData),
            attachments,
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