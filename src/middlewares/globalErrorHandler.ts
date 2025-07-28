import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';

export const globalErrorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let details: any = null;

    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
    } else if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
        details = error.message;
    } else if (error.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
    } else if (error.name === 'MongoServerError' && (error as any).code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value';
        const field = Object.keys((error as any).keyValue)[0];
        details = `${field} already exists`;
    } else if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    } else if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token has expired';
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', error);
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(details && { details }),
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
};
