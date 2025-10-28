import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

export class NotificationController {
    static sendParcelEmails = catchAsync(async (req: Request, res: Response) => {
        return sendResponse(res, {
            statuscode: 200,
            success: true,
            message: 'Email notifications are disabled',
            data: {
                senderEmailSent: false,
                receiverEmailSent: false,
                note: 'Email service has been removed from this application',
            },
        });
    });
}

export default NotificationController;
