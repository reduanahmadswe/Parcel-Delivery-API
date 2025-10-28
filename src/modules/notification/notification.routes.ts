import { Router } from 'express';
import NotificationController from './notification.controller';

const router = Router();

// POST /api/notifications/send-parcel-emails
router.post('/send-parcel-emails', NotificationController.sendParcelEmails);

export const notificationRoutes = router;
