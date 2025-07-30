/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as jwt from 'jsonwebtoken';
import { IUser } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import { AppError } from '../utils/AppError';
import { IJWTPayload } from './helpers';


/**
 * Create access and refresh tokens for a user
 */
export const createUserTokens = (user: Partial<IUser>) => {
    const jwtPayload: IJWTPayload = {
        userId: user._id!,
        email: user.email!,
        role: user.role!,
    };

    const accessSecret = process.env.JWT_ACCESS_SECRET || 'access-secret';
    const refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh-secret';
    const accessExpires = process.env.JWT_ACCESS_EXPIRES || '15m';
    const refreshExpires = process.env.JWT_REFRESH_EXPIRES || '7d';

    // Use same pattern as helpers.ts
    const accessToken = jwt.sign(jwtPayload, accessSecret, { expiresIn: accessExpires } as jwt.SignOptions);
    const refreshToken = jwt.sign(jwtPayload, refreshSecret, { expiresIn: refreshExpires } as jwt.SignOptions);

    return {
        accessToken,
        refreshToken,
    };
};

/**
 * Create new access token using refresh token
 */
export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
    try {
        const refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh-secret';
        const verifiedRefreshToken = jwt.verify(refreshToken, refreshSecret) as IJWTPayload;

        const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

        if (!isUserExist) {
            throw new AppError('User does not exist', 400);
        }

        if (isUserExist.isBlocked) {
            throw new AppError('User is blocked', 400);
        }

        const jwtPayload: IJWTPayload = {
            userId: isUserExist._id,
            email: isUserExist.email,
            role: isUserExist.role,
        };

        const accessSecret = process.env.JWT_ACCESS_SECRET || 'access-secret';
        const accessExpires = process.env.JWT_ACCESS_EXPIRES || '15m';

        // Use same pattern as helpers.ts
        const accessToken = jwt.sign(jwtPayload, accessSecret, { expiresIn: accessExpires } as jwt.SignOptions);

        return accessToken;
    } catch (error) {
        throw new AppError('Invalid refresh token', 401);
    }
};
