import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validation';
import { ParcelController } from './parcel.controller';
import {
    createParcelValidation,
    parcelIdValidation,
    parcelQueryValidation,
    trackingIdValidation,
    updateParcelStatusValidation
} from './parcel.validation';

const router = Router();

// Public routes
router.get('/track/:trackingId',
    validateRequest(trackingIdValidation),
    ParcelController.getParcelByTrackingId
);

// Protected routes
router.use(authenticate);

// Sender routes
router.post('/',
    authorize('sender'),
    validateRequest(createParcelValidation),
    ParcelController.createParcel
);

router.patch('/:id/cancel',
    authorize('sender'),
    validateRequest(parcelIdValidation),
    ParcelController.cancelParcel
);

// Receiver routes
router.patch('/:id/confirm-delivery',
    authorize('receiver'),
    validateRequest(parcelIdValidation),
    ParcelController.confirmDelivery
);

// Shared routes (sender and receiver)
router.get('/me',
    authorize('sender', 'receiver'),
    validateRequest(parcelQueryValidation),
    ParcelController.getMyParcels
);

router.get('/:id',
    authorize('sender', 'receiver', 'admin'),
    validateRequest(parcelIdValidation),
    ParcelController.getParcelById
);

// Admin routes
router.use(authorize('admin'));

router.get('/',
    validateRequest(parcelQueryValidation),
    ParcelController.getAllParcels
);

router.get('/admin/stats',
    ParcelController.getParcelStats
);

router.patch('/:id/status',
    validateRequest(parcelIdValidation),
    validateRequest(updateParcelStatusValidation),
    ParcelController.updateParcelStatus
);

router.patch('/:id/block-status',
    validateRequest(parcelIdValidation),
    ParcelController.toggleParcelBlockStatus
);

export const parcelRoutes = router;
