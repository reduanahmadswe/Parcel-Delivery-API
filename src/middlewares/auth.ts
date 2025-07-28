import { NextFunction, Request, Response } from 'express';
import { UserService } from '../modules/user/user.service';
import { AppError } from '../utils/AppError';
import { IJWTPayload, verifyToken } from '../utils/helpers';

// Extend Request interface locally
interface AuthenticatedRequest extends Request {
    user: IJWTPayload;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = req.cookies.token || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null);

        if (!token) {
            throw new AppError('Access token is required', 401);
        }

        const decoded = verifyToken(token);
        const user = await UserService.getUserById(decoded.userId);

        if (!user) {
            throw new AppError('User not found', 401);
        }

        if (user.isBlocked) {
            throw new AppError('Your account has been blocked', 403);
        }

        (req as any).user = {
            userId: user._id,
            email: user.email,
            role: user.role
        };

        next();
    } catch (error) {
        if (error instanceof AppError) {
            next(error);
        } else {
            next(new AppError('Invalid or expired token', 401));
        }
    }
};

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!user) {
            return next(new AppError('Authentication required', 401));
        }

        if (!roles.includes(user.role)) {
            return next(new AppError('Access forbidden: Insufficient permissions', 403));
        }

        next();
    };
};
