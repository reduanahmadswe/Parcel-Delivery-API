import * as jwt from 'jsonwebtoken';
import { IUser } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import { AppError } from './AppError';

export interface IJWTPayload {
    userId: string;
    email: string;
    role: string;
}

export const generateToken = (user: IUser): string => {
    const payload: IJWTPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    };

    const secret = process.env.JWT_SECRET || 'fallback-secret';

    return jwt.sign(payload, secret, { expiresIn: '7d' });
};

export const verifyToken = (token: string): IJWTPayload => {
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    return jwt.verify(token, secret) as IJWTPayload;
};

/**
 * Create access and refresh tokens for a user
 */
export const createUserTokens = (user: Partial<IUser>) => {
    // For now, create simple tokens using the existing generateToken function
    const userForToken = {
        _id: user._id!,
        email: user.email!,
        role: user.role!
    } as IUser;

    const accessToken = generateToken(userForToken);
    const refreshToken = generateToken(userForToken);

    return {
        accessToken,
        refreshToken
    };
};

/**
 * Create new access token using refresh token (simplified version)
 */
export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
    try {
        const verifiedRefreshToken = verifyToken(refreshToken);

        const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

        if (!isUserExist) {
            throw new AppError('User does not exist', 400);
        }

        if (isUserExist.isBlocked) {
            throw new AppError('User is blocked', 400);
        }

        const accessToken = generateToken(isUserExist);
        return accessToken;
    } catch (error) {
        throw new AppError('Invalid refresh token', 401);
    }
};

export const generateTrackingId = (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Generate a more robust 6-character random string
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let random = '';
    for (let i = 0; i < 6; i++) {
        random += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return `TRK-${year}${month}${day}-${random}`;
};

export const calculateDeliveryFee = (weight: number, distance?: number): number => {
    // Base fee calculation
    const baseFee = 50; // Base fee in BDT
    const weightFee = weight * 20; // 20 BDT per kg
    const distanceFee = distance ? distance * 5 : 0; // 5 BDT per km (optional)

    return baseFee + weightFee + distanceFee;
};
