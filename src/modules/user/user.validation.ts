/* eslint-disable no-useless-escape */
import { z } from 'zod';

const addressSchema = z.object({
    street: z.string().min(1, 'Street address is required').trim(),
    city: z.string().min(1, 'City is required').trim(),
    state: z.string().min(1, 'State is required').trim(),
    zipCode: z.string().min(1, 'ZIP code is required').trim(),
    country: z.string().min(1, 'Country is required').trim().default('Bangladesh'),
});

export const createUserValidation = z.object({
    body: z.object({
        email: z.string().email('Please enter a valid email').toLowerCase().trim(),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters').trim(),
        phone: z.string().min(1, 'Phone number is required').regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'),
        role: z.enum(['sender', 'receiver']),
        address: addressSchema,
    }),
});

export const updateUserValidation = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters').trim().optional(),
        phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number').optional(),
        address: z.object({
            street: z.string().min(1, 'Street address is required').trim().optional(),
            city: z.string().min(1, 'City is required').trim().optional(),
            state: z.string().min(1, 'State is required').trim().optional(),
            zipCode: z.string().min(1, 'ZIP code is required').trim().optional(),
            country: z.string().min(1, 'Country is required').trim().optional(),
        }).optional(),
    }),
});

export const loginValidation = z.object({
    body: z.object({
        email: z.string().email('Please enter a valid email').toLowerCase().trim(),
        password: z.string().min(1, 'Password is required'),
    }),
});

export const userIdValidation = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
    }),
});

export const toggleUserBlockStatusValidation = z.object({
    body: z.object({
        isBlocked: z.boolean({ message: 'isBlocked field is required and must be a boolean' }),
    }),
});
