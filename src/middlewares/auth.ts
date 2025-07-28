import { NextFunction, Request, Response } from 'express';
import { UserService } from '../modules/user/user.service';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { IJWTPayload, verifyToken } from '../utils/helpers';

// Extend Request interface locally
interface AuthenticatedRequest extends Request {
    user: IJWTPayload;
}

export const authenticate = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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
});

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
