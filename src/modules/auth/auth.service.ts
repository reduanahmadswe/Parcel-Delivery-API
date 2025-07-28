import { AppError } from '../../utils/AppError';
import { generateToken } from '../../utils/helpers';
import { ICreateUser, ILoginUser } from '../user/user.interface';
import { UserService } from '../user/user.service';
import { IAuthResponse } from './auth.interface';

export class AuthService {
    // Register new user
    static async register(userData: ICreateUser): Promise<IAuthResponse> {
        const user = await UserService.createUser(userData);

        // Generate token
        const token = generateToken({
            _id: user._id,
            email: user.email,
            role: user.role
        } as any);

        return {
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                isBlocked: user.isBlocked,
                isVerified: user.isVerified
            },
            token
        };
    }

    // Login user
    static async login(loginData: ILoginUser): Promise<IAuthResponse> {
        const { email, password } = loginData;

        // Find user with password
        const user = await UserService.getUserByEmail(email);
        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        // Check if user is blocked
        if (user.isBlocked) {
            throw new AppError('Your account has been blocked', 403);
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new AppError('Invalid email or password', 401);
        }

        // Generate token
        const token = generateToken(user);

        return {
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                isBlocked: user.isBlocked,
                isVerified: user.isVerified
            },
            token
        };
    }

    // Refresh token (optional)
    static async refreshToken(userId: string): Promise<{ token: string }> {
        const user = await UserService.getUserById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        if (user.isBlocked) {
            throw new AppError('Your account has been blocked', 403);
        }

        const token = generateToken({
            _id: user._id,
            email: user.email,
            role: user.role
        } as any);

        return { token };
    }
}
