import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from '../utils/AppError';

export const validateRequest = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const validation = schema.safeParse({
                body: req.body,
                params: req.params,
                query: req.query
            });

            if (!validation.success) {
                const errors = validation.error.issues.map((error: any) => ({
                    path: error.path.join('.'),
                    message: error.message
                }));

                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors
                });
                return;
            }

            // Set validated data back to request
            const validatedData = validation.data as any;
            if (validatedData.body) {
                req.body = validatedData.body;
            }
            if (validatedData.params) {
                req.params = validatedData.params;
            }
            if (validatedData.query) {
                req.query = validatedData.query;
            }

            next();
        } catch (error) {
            next(new AppError('Validation error', 400));
        }
    };
};
