import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import { IJWTPayload } from '../../utils/helpers';
import { UserService } from './user.service';

// Extend Request interface locally for authenticated requests
interface AuthenticatedRequest extends Request {
    user: IJWTPayload;
}

export class UserController {
    // Get current user profile
    static async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.userId;
            const user = await UserService.getUserById(userId);

            res.status(200).json({
                success: true,
                message: 'Profile retrieved successfully',
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    // Update current user profile
    static async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.userId;
            const updateData = req.body;

            const updatedUser = await UserService.updateUser(userId, updateData);

            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: updatedUser
            });
        } catch (error) {
            next(error);
        }
    }

    // Get all users (admin only)
    static async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
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
        } catch (error) {
            next(error);
        }
    }

    // Get user by ID (admin only)
    static async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const user = await UserService.getUserById(id);

            res.status(200).json({
                success: true,
                message: 'User retrieved successfully',
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    // Block/Unblock user (admin only)
    static async toggleUserBlockStatus(req: Request, res: Response, next: NextFunction) {
        try {
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
        } catch (error) {
            next(error);
        }
    }

    // Delete user (admin only)
    static async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await UserService.deleteUser(id);

            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    // Get user statistics (admin only)
    static async getUserStats(req: Request, res: Response, next: NextFunction) {
        try {
            const stats = await UserService.getUserStats();

            res.status(200).json({
                success: true,
                message: 'User statistics retrieved successfully',
                data: stats
            });
        } catch (error) {
            next(error);
        }
    }
}
