import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export const validateRequest = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const validation = schema.safeParse({
                body: req.body,
                params: req.params,
                query: req.query
            });

            if (!validation.success) {
                // Throw ZodError to be handled by global error handler
                throw validation.error;
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
            next(error);
        }
    };
};
