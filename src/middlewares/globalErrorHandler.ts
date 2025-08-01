/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { envVars } from '../config/env';
import { handleCastError } from '../helpers/handleCastError';
import { handlerDuplicateError } from '../helpers/handlerDuplicateError';
import { handlerValidationError } from '../helpers/handlerValidationError';
import { handlerZodError } from '../helpers/handlerZodError';
import { TErrorSources } from '../types/error.types';
import { AppError } from '../utils/AppError';
import { sendResponse } from '../utils/sendResponse';

export const globalErrorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let errorSources: TErrorSources[] = [];

    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
        // If AppError has custom data, use it instead of default error structure
        if (error.data) {
            sendResponse(res, {
                statuscode: statusCode,
                success: false,
                message,
                data: error.data,
            });
            return;
        }
    }
    else if (error.name === 'ValidationError') {
        const simplifiedError = handlerValidationError(error as any);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources || [];
    }
    else if (error.name === 'CastError') {
        const simplifiedError = handleCastError(error as any);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    else if (error.name === 'MongoServerError' && (error as any).code === 11000) {
        const simplifiedError = handlerDuplicateError(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    else if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }
    else if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token has expired';
    }
    else if (error.name === 'ZodError') {
        const simplifiedError = handlerZodError(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources || [];
    }

    // Log error in development
    if (envVars.NODE_ENV === 'development') {
        console.error('Error:', error);
    }

    // Use sendResponse for consistent error formatting
    sendResponse(res, {
        statuscode: statusCode,
        success: false,
        message,
        data: {
            errorSources: errorSources.length > 0 ? errorSources : undefined,
            ...(envVars.NODE_ENV === 'development' && { stack: error.stack }),
        },
    });
};
