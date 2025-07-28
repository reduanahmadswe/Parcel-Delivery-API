import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import { catchAsync } from '../../utils/catchAsync';
import { IJWTPayload } from '../../utils/helpers';
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

        res.status(200).json({
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

        res.status(200).json({
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

        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: result.users,
            pagination: {
                currentPage: page,
                totalPages: result.totalPages,
                totalCount: result.totalCount,
                limit
            }
        });
    });

    // Get user by ID (admin only)
    static getUserById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const user = await UserService.getUserById(id);

        res.status(200).json({
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

        res.status(200).json({
            success: true,
            message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
            data: updatedUser
        });
    });

    // Delete user (admin only)
    static deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        await UserService.deleteUser(id);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    });

    // Get user statistics (admin only)
    static getUserStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const stats = await UserService.getUserStats();

        res.status(200).json({
            success: true,
            message: 'User statistics retrieved successfully',
            data: stats
        });
    });
}
