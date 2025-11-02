
import { AppError } from '../../utils/AppError';
import { createNewAccessTokenWithRefreshToken, createUserTokens } from '../../utils/helpers';
import { ICreateUser, ILoginUser } from '../user/user.interface';
import { UserService } from '../user/user.service';
import { IAuthResponse } from './auth.interface';

export class AuthService {
    // Register new user
    static async register(userData: ICreateUser): Promise<IAuthResponse> {
        const user = await UserService.createUser(userData);

        // Generate tokens
        const tokens = createUserTokens(user);

        return {
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                isBlocked: user.isBlocked,
                isVerified: user.isVerified,
            },
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
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

        // Generate tokens
        const tokens = createUserTokens(user);

        return {
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                isBlocked: user.isBlocked,
                isVerified: user.isVerified,
            },
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }


    // Check if email exists
    static async checkEmailExists(email: string): Promise<boolean> {
        const user = await UserService.getUserByEmail(email);
        return !!user;
    }

    // Refresh token
    static async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
        const accessToken = await createNewAccessTokenWithRefreshToken(refreshToken);
        return { accessToken };
    }
}
