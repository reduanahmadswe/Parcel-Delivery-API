import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service';

export class AuthController {
    // Register new user
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const userData = req.body;
            const result = await AuthService.register(userData);

            // Set token in cookie
            res.cookie('token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    user: result.user,
                    token: result.token
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // Login user
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const loginData = req.body;
            const result = await AuthService.login(loginData);

            // Set token in cookie
            res.cookie('token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    user: result.user,
                    token: result.token
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // Logout user
    static async logout(req: Request, res: Response, next: NextFunction) {
        try {
            res.clearCookie('token');
            res.status(200).json({
                success: true,
                message: 'Logout successful'
            });
        } catch (error) {
            next(error);
        }
    }

    // Refresh token
    static async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.userId;
            const result = await AuthService.refreshToken(userId);

            // Set new token in cookie
            res.cookie('token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.status(200).json({
                success: true,
                message: 'Token refreshed successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    // Check authentication status
    static async me(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json({
                success: true,
                message: 'User authenticated',
                data: {
                    user: (req as any).user
                }
            });
        } catch (error) {
            next(error);
        }
    }
}
