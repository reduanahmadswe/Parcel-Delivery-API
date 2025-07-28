import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import { catchAsync } from '../../utils/catchAsync';
import { IJWTPayload } from '../../utils/helpers';
import { sendResponse } from '../../utils/sendResponse';
import { UserService } from './user.service';

// Extend Request interface locally for authenticated requests
interface AuthenticatedRequest extends Request {
    user: IJWTPayload;
}

export class UserController {
    // Get current user profile
    static getProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user.userId;
        const user = await UserService.getUserById(userId);

        sendResponse(res, {
            statuscode: 200,
            success: true,
            message: 'Profile retrieved successfully',
            data: user
        });
    });

    // Update current user profile
    static updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user.userId;
        const updateData = req.body;

        const updatedUser = await UserService.updateUser(userId, updateData);

        sendResponse(res, {
            statuscode: 200,
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        });
    });

    // Get all users (admin only)
    static getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const role = req.query.role as string;
        const isBlocked = req.query.isBlocked === 'true' ? true :
            req.query.isBlocked === 'false' ? false : undefined;

        const result = await UserService.getAllUsers(page, limit, role, isBlocked);

        sendResponse(res, {
            statuscode: 200,
            success: true,
            message: 'Users retrieved successfully',
            data: result.users,
            meta: {
                page: page,
                limit: limit,
                total: result.totalCount,
                totalPages: result.totalPages
            }
        });
    });

    // Get user by ID (admin only)
    static getUserById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const user = await UserService.getUserById(id);

        sendResponse(res, {
            statuscode: 200,
            success: true,
            message: 'User retrieved successfully',
            data: user
        });
    });

    // Block/Unblock user (admin only)
    static toggleUserBlockStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { isBlocked } = req.body;

        if (typeof isBlocked !== 'boolean') {
            throw new AppError('isBlocked must be a boolean value', 400);
        }

        const updatedUser = await UserService.toggleUserBlockStatus(id, isBlocked);

        sendResponse(res, {
            statuscode: 200,
            success: true,
            message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
            data: updatedUser
        });
    });

    // Delete user (admin only)
    static deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        await UserService.deleteUser(id);

        sendResponse(res, {
            statuscode: 200,
            success: true,
            message: 'User deleted successfully',
            data: null
        });
    });

    // Get user statistics (admin only)
    static getUserStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const stats = await UserService.getUserStats();

        sendResponse(res, {
            statuscode: 200,
            success: true,
            message: 'User statistics retrieved successfully',
            data: stats
        });
    });
}
