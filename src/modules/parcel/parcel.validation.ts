import { z } from 'zod';

const addressSchema = z.object({
    street: z.string().min(1, 'Street address is required').trim(),
    city: z.string().min(1, 'City is required').trim(),
    state: z.string().min(1, 'State is required').trim(),
    zipCode: z.string().min(1, 'ZIP code is required').trim(),
    country: z.string().min(1, 'Country is required').trim().default('Bangladesh'),
});

const receiverInfoSchema = z.object({
    phone: z.string().min(1, 'Phone number is required').trim().optional(),
    address: addressSchema.optional(),
});

const dimensionsSchema = z.object({
    length: z.number().min(0.1, 'Length must be greater than 0'),
    width: z.number().min(0.1, 'Width must be greater than 0'),
    height: z.number().min(0.1, 'Height must be greater than 0'),
}).optional();

const parcelDetailsSchema = z.object({
    type: z.enum(['document', 'package', 'fragile', 'electronics', 'clothing', 'other']),
    weight: z.number().min(0.1, 'Weight must be greater than 0').max(50, 'Weight cannot exceed 50kg'),
    dimensions: dimensionsSchema,
    description: z.string().min(1, 'Description is required').max(500, 'Description cannot exceed 500 characters').trim(),
    value: z.number().min(0, 'Value cannot be negative').optional(),
});

const deliveryInfoSchema = z.object({
    preferredDeliveryDate: z.string().datetime().optional().transform((date) => date ? new Date(date) : undefined),
    deliveryInstructions: z.string().max(200, 'Delivery instructions cannot exceed 200 characters').trim().optional(),
    isUrgent: z.boolean().default(false),
});

export const createParcelValidation = z.object({
    body: z.object({
        receiverEmail: z.string()
            .min(1, 'Receiver email is required')
            .email('Please enter a valid email address')
            .toLowerCase()
            .trim(),
        receiverInfo: receiverInfoSchema.optional(),
        parcelDetails: parcelDetailsSchema,
        deliveryInfo: deliveryInfoSchema,
    }),
});

export const updateParcelStatusValidation = z.object({
    body: z.object({
        status: z.enum(['approved', 'dispatched', 'in-transit', 'delivered', 'cancelled', 'returned']),
        location: z.string().trim().optional(),
        note: z.string().max(200, 'Note cannot exceed 200 characters').trim().optional(),
    }),
});

export const parcelIdValidation = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid parcel ID format'),
    }),
});

export const trackingIdValidation = z.object({
    params: z.object({
        trackingId: z.string().regex(/^TRK-\d{8}-[A-Z0-9]{6}$/, 'Invalid tracking ID format'),
    }),
});

export const parcelQueryValidation = z.object({
    query: z.object({
        page: z.string().transform((val) => parseInt(val) || 1).optional(),
        limit: z.string().transform((val) => parseInt(val) || 10).optional(),
        status: z.enum(['requested', 'approved', 'dispatched', 'in-transit', 'delivered', 'cancelled', 'returned']).optional(),
        isUrgent: z.string().transform((val) => val === 'true' ? true : val === 'false' ? false : undefined).optional(),
        startDate: z.string().datetime().optional().transform((date) => date ? new Date(date) : undefined),
        endDate: z.string().datetime().optional().transform((date) => date ? new Date(date) : undefined),
        // Enhanced admin filters
        search: z.string().trim().optional(),
        senderId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid sender ID format').optional(),
        receiverId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid receiver ID format').optional(),
        senderEmail: z.string().email('Invalid sender email format').optional(),
        receiverEmail: z.string().email('Invalid receiver email format').optional(),
        isFlagged: z.string().transform((val) => val === 'true' ? true : val === 'false' ? false : undefined).optional(),
        isHeld: z.string().transform((val) => val === 'true' ? true : val === 'false' ? false : undefined).optional(),
        isBlocked: z.string().transform((val) => val === 'true' ? true : val === 'false' ? false : undefined).optional(),
    }),
});

export const toggleParcelBlockStatusValidation = z.object({
    body: z.object({
        isBlocked: z.boolean({ message: 'isBlocked field is required and must be a boolean' }),
    }),
});

export const assignDeliveryPersonnelValidation = z.object({
    body: z.object({
        deliveryPersonnel: z.string().min(1, 'Delivery personnel name is required').max(100, 'Name cannot exceed 100 characters').trim(),
    }),
});

export const flagParcelValidation = z.object({
    body: z.object({
        isFlagged: z.boolean({ message: 'isFlagged field is required and must be a boolean' }),
        note: z.string().max(200, 'Note cannot exceed 200 characters').trim().optional(),
    }),
});

export const holdParcelValidation = z.object({
    body: z.object({
        isHeld: z.boolean({ message: 'isHeld field is required and must be a boolean' }),
        note: z.string().max(200, 'Note cannot exceed 200 characters').trim().optional(),
    }),
});

export const unblockParcelValidation = z.object({
    body: z.object({
        note: z.string().max(200, 'Note cannot exceed 200 characters').trim().optional(),
    }).optional().default({}),
});

export const returnParcelValidation = z.object({
    body: z.object({
        note: z.string().max(200, 'Note cannot exceed 200 characters').trim().optional(),
    }).optional().default({}),
});
