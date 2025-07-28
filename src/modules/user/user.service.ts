import mongoose from 'mongoose';
import { AppError } from '../../utils/AppError';
import { ICreateUser, IUpdateUser, IUser, IUserResponse } from './user.interface';
import { User } from './user.model';

export class UserService {
    // Create new user
    static async createUser(userData: ICreateUser): Promise<IUserResponse> {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new AppError('User with this email already exists', 400);
        }

        const user = new User(userData);
        await user.save();

        return user.toJSON();
    }

    // Get user by ID
    static async getUserById(id: string): Promise<IUserResponse | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid user ID format', 400);
        }

        const user = await User.findById(id);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        return user.toJSON();
    }

    // Get user by email (for login)
    static async getUserByEmail(email: string): Promise<IUser | null> {
        return User.findOne({ email }).select('+password');
    }

    // Update user
    static async updateUser(id: string, updateData: IUpdateUser): Promise<IUserResponse | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid user ID format', 400);
        }

        const user = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!user) {
            throw new AppError('User not found', 404);
        }

        return user.toJSON();
    }

    // Get all users (admin only)
    static async getAllUsers(
        page: number = 1,
        limit: number = 10,
        role?: string,
        isBlocked?: boolean
    ): Promise<{ users: IUserResponse[]; totalCount: number; totalPages: number }> {
        const skip = (page - 1) * limit;
        const filter: any = {};

        if (role) {
            filter.role = role;
        }

        if (typeof isBlocked === 'boolean') {
            filter.isBlocked = isBlocked;
        }

        const [users, totalCount] = await Promise.all([
            User.find(filter)
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            User.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return {
            users: users.map(user => user.toJSON()),
            totalCount,
            totalPages
        };
    }

    // Block/Unblock user (admin only)
    static async toggleUserBlockStatus(id: string, isBlocked: boolean): Promise<IUserResponse> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid user ID format', 400);
        }

        const user = await User.findByIdAndUpdate(
            id,
            { isBlocked },
            { new: true, runValidators: true }
        );

        if (!user) {
            throw new AppError('User not found', 404);
        }

        return user.toJSON();
    }

    // Delete user (admin only)
    static async deleteUser(id: string): Promise<void> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid user ID format', 400);
        }

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            throw new AppError('User not found', 404);
        }
    }

    // Get user statistics (admin only)
    static async getUserStats(): Promise<{
        totalUsers: number;
        senders: number;
        receivers: number;
        admins: number;
        blockedUsers: number;
        verifiedUsers: number;
    }> {
        const stats = await User.aggregate([
            {
                $group: {
                    _id: null,
                    totalUsers: { $sum: 1 },
                    senders: {
                        $sum: { $cond: [{ $eq: ['$role', 'sender'] }, 1, 0] }
                    },
                    receivers: {
                        $sum: { $cond: [{ $eq: ['$role', 'receiver'] }, 1, 0] }
                    },
                    admins: {
                        $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] }
                    },
                    blockedUsers: {
                        $sum: { $cond: ['$isBlocked', 1, 0] }
                    },
                    verifiedUsers: {
                        $sum: { $cond: ['$isVerified', 1, 0] }
                    }
                }
            }
        ]);

        return stats[0] || {
            totalUsers: 0,
            senders: 0,
            receivers: 0,
            admins: 0,
            blockedUsers: 0,
            verifiedUsers: 0
        };
    }
}
