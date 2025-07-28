import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AuthService } from './auth.service';

export class AuthController {
    // Register new user
    static register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const userData = req.body;
        const result = await AuthService.register(userData);

        // Set token in cookie
        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        sendResponse(res, {
            statuscode: 201,
            success: true,
            message: 'User registered successfully',
            data: {
                user: result.user,
                token: result.token
            }
        });
    });

    // Login user
    static login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const loginData = req.body;
        const result = await AuthService.login(loginData);

        // Set token in cookie
        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        sendResponse(res, {
            statuscode: 200,
            success: true,
            message: 'Login successful',
            data: {
                user: result.user,
                token: result.token
            }
        });
    });

    // Logout user
    static logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        res.clearCookie('token');
        sendResponse(res, {
            statuscode: 200,
            success: true,
            message: 'Logout successful',
            data: null
        });
    });

    // Refresh token
    static refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user.userId;
        const result = await AuthService.refreshToken(userId);

        // Set new token in cookie
        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        sendResponse(res, {
            statuscode: 200,
            success: true,
            message: 'Token refreshed successfully',
            data: result
        });
    });

    // Check authentication status
    static me = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        sendResponse(res, {
            statuscode: 200,
            success: true,
            message: 'User authenticated',
            data: {
                user: (req as any).user
            }
        });
    });
}
