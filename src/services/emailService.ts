import nodemailer from 'nodemailer';
import { envVars } from '../config/env';

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

    // Sender email
    if (senderEmail) {
        const senderMailOptions = {
            from: fromAddress,
            to: senderEmail,
            subject: `✅ Parcel Created Successfully - ${trackingId}`,
            html: `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>
              <h2>Parcel Created</h2>
              <p>Hi ${senderName || 'Customer'},</p>
              <p>Your parcel has been created. Tracking ID: <strong>${trackingId}</strong></p>
              <p>Receiver: ${receiverName || ''} &lt;${receiverEmail || ''}&gt;</p>
              <p>View tracking: <a href="${envVars.FRONTEND_URL || 'http://localhost:5173'}/track?id=${trackingId}">Track parcel</a></p>
              </body></html>`,
        };

        try {
            // sendMail returns a Promise in nodemailer v6+ when using async/await
            const info = await transporter.sendMail(senderMailOptions as any);
            results.sender = info;

            console.info('✅ Sender email sent:', info.messageId || info);
        } catch (error: any) {

            console.error('❌ Sender email error:', error?.message || error);
            results.sender = { error: error?.message || String(error) };
        }
    }

    // Receiver email
    if (receiverEmail) {
        const receiverMailOptions = {
            from: fromAddress,
            to: receiverEmail,
            subject: `📦 You Have a Parcel Coming - ${trackingId}`,
            html: `<!doctype html><html><head><meta charset="utf-8"></head><body>
              <h2>Parcel Notification</h2>
              <p>Hi ${receiverName || 'Customer'},</p>
              <p>You have a parcel coming from ${senderName || ''}.</p>
              <p>Tracking ID: <strong>${trackingId}</strong></p>
              <p>Delivery address: ${receiverAddress?.street || ''} ${receiverAddress?.city || ''}</p>
              <p>Track: <a href="${envVars.FRONTEND_URL || 'http://localhost:5173'}/track?id=${trackingId}">Track parcel</a></p>
              </body></html>`,
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