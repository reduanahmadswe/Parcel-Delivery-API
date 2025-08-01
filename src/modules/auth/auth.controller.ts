/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { clearAuthCookies, setAuthCookie } from '../../utils/authTokens';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AuthService } from './auth.service';

export class AuthController {
    // Register new user
    static register = catchAsync(async (req: Request, res: Response) => {
        const userData = req.body;
        const result = await AuthService.register(userData);

        // Set tokens in cookies
        setAuthCookie(res, {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });

        sendResponse(res, {
            statuscode: 201,
            success: true,
            message: 'User registered successfully',
            data: {
                user: result.user,
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
            },
        });
    });

    // Login user
    static login = catchAsync(async (req: Request, res: Response) => {
        const loginData = req.body;
        const result = await AuthService.login(loginData);

        // Set tokens in cookies
        setAuthCookie(res, {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });

        sendResponse(res, {
            statuscode: 200,
            success: true,
            message: 'Login successful',
            data: {
                user: result.user,
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
            },
        });
    });

    // Logout user
    static logout = catchAsync(async (req: Request, res: Response) => {
        clearAuthCookies(res);
        sendResponse(res, {
            statuscode: 200,
            success: true,
            message: 'Logout successful',
            data: null,
        });
    });

    // Refresh token
    static refreshToken = catchAsync(async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return sendResponse(res, {
                statuscode: 401,
                success: false,
                message: 'Refresh token not provided',
                data: null,
            });
        }

        const result = await AuthService.refreshToken(refreshToken);

        // Set new access token in cookie
        setAuthCookie(res, {
            accessToken: result.accessToken,
        });

        sendResponse(res, {
            statuscode: 200,
            success: true,
            message: 'Token refreshed successfully',
            data: result,
        });
    });

    // Check authentication status
    static me = catchAsync(async (req: Request, res: Response) => {
        sendResponse(res, {
            statuscode: 200,
            success: true,
            message: 'User authenticated',
            data: {
                user: (req as any).user,
            },
        });
    });
}
