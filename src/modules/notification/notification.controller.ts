import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { sendParcelNotificationEmails } from '../../services/emailService';

export class NotificationController {
    static sendParcelEmails = catchAsync(async (req: Request, res: Response) => {
        const parcelData = req.body;

        if (!parcelData?.trackingId) {
            return sendResponse(res, {
                statuscode: 400,
                success: false,
                message: 'Tracking ID is required',
                data: null,
            });
        }

        console.info('📧 Sending parcel notification emails for:', parcelData.trackingId);

        const results = await sendParcelNotificationEmails(parcelData);

        return sendResponse(res, {
            statuscode: 200,
            success: true,
            message: 'Notification emails sent successfully',
            data: {
                senderEmailSent: !!results.sender && !(results.sender as any).error,
                receiverEmailSent: !!results.receiver && !(results.receiver as any).error,
                results,
            },
        });
    });
}

export default NotificationController;
