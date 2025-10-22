import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validation';
import { ParcelController } from './parcel.controller';
import {
    assignDeliveryPersonnelValidation,
    createParcelValidation,
    flagParcelValidation,
    holdParcelValidation,
    parcelIdValidation,
    parcelQueryValidation,
    returnParcelValidation,
    toggleParcelBlockStatusValidation,
    trackingIdValidation,
    unblockParcelValidation,
    updateParcelStatusValidation,
} from './parcel.validation';

const router = Router();

// Public routes
router.get('/track/:trackingId',
    validateRequest(trackingIdValidation),
    ParcelController.getParcelByTrackingId,
);

// Protected routes
router.use(authenticate);

// Sender routes
router.post('/',
    authorize('sender'),
    validateRequest(createParcelValidation),
    ParcelController.createParcel,
);

router.patch('/cancel/:id',
    authorize('sender'),
    validateRequest(parcelIdValidation),
    ParcelController.cancelParcel,
);

// Receiver routes

// Receiver: View delivery history
router.get('/receiver/delivery-history',
    authorize('receiver'),
    ParcelController.getReceiverDeliveryHistory,
);

router.patch('/:id/confirm-delivery',
    authorize('receiver'),
    validateRequest(parcelIdValidation),
    ParcelController.confirmDelivery,
);

// Shared routes (sender and receiver)
router.get('/me',
    authorize('sender', 'receiver'),
    validateRequest(parcelQueryValidation),
    ParcelController.getMyParcels,
);

// Shared routes (sender, receiver, and admin)
router.get('/me/no-pagination',
    authorize('sender', 'receiver', 'admin'),
    ParcelController.getMyParcelsNoPagination,
);

router.get('/:id',
    authorize('sender', 'receiver', 'admin'),
    validateRequest(parcelIdValidation),
    ParcelController.getParcelById,
);

router.get('/:id/status-log',
    authorize('sender', 'receiver', 'admin'),
    validateRequest(parcelIdValidation),
    ParcelController.getParcelStatusLog,
);

// Admin routes
router.use(authorize('admin'));

router.get('/',
    validateRequest(parcelQueryValidation),
    ParcelController.getAllParcels,
);

router.get('/admin/stats',
    ParcelController.getParcelStats,
);

router.patch('/:id/status',
    validateRequest(parcelIdValidation),
    validateRequest(updateParcelStatusValidation),
    ParcelController.updateParcelStatus,
);

router.patch('/:id/block-status',
    validateRequest(parcelIdValidation),
    validateRequest(toggleParcelBlockStatusValidation),
    ParcelController.toggleParcelBlockStatus,
);

router.patch('/:id/assign-personnel',
    validateRequest(parcelIdValidation),
    validateRequest(assignDeliveryPersonnelValidation),
    ParcelController.assignDeliveryPersonnel,
);

router.patch('/:id/flag',
    validateRequest(parcelIdValidation),
    validateRequest(flagParcelValidation),
    ParcelController.flagParcel,
);

router.patch('/:id/hold',
    validateRequest(parcelIdValidation),
    validateRequest(holdParcelValidation),
    ParcelController.holdParcel,
);

router.patch('/:id/unblock',
    validateRequest(parcelIdValidation),
    validateRequest(unblockParcelValidation),
    ParcelController.unblockParcel,
);

router.patch('/:id/return',
    validateRequest(parcelIdValidation),
    validateRequest(returnParcelValidation),
    ParcelController.returnParcel,
);

router.delete('/:id',
    validateRequest(parcelIdValidation),
    ParcelController.deleteParcel,
);

export const parcelRoutes = router;
