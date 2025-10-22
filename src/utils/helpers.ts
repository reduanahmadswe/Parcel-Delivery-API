/* eslint-disable @typescript-eslint/no-non-null-assertion */

import * as jwt from 'jsonwebtoken';
import { envVars } from '../config/env';
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
        role: user.role,
    };

    return jwt.sign(payload, envVars.JWT_SECRET as jwt.Secret, { expiresIn: '7d' } as jwt.SignOptions);
};

export const verifyToken = (token: string): IJWTPayload => {
    const secret = envVars.JWT_SECRET;
    return jwt.verify(token, secret) as IJWTPayload;
};

/**
 * Create access and refresh tokens for a user
 */
export const createUserTokens = (user: Partial<IUser>) => {
    const payload: IJWTPayload = {
        userId: user._id!,
        email: user.email!,
        role: user.role!,
    };

    // Create separate access and refresh tokens with different expiration times
    const accessToken = jwt.sign(payload, envVars.JWT_ACCESS_SECRET as jwt.Secret, {
        expiresIn: envVars.JWT_ACCESS_EXPIRES,
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(payload, envVars.JWT_REFRESH_SECRET as jwt.Secret, {
        expiresIn: envVars.JWT_REFRESH_EXPIRES,
    } as jwt.SignOptions);

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
        // Verify refresh token with refresh secret
        const decoded = jwt.verify(refreshToken, envVars.JWT_REFRESH_SECRET as jwt.Secret) as IJWTPayload;

        // Check if user exists
        const user = await User.findById(decoded.userId);

        if (!user) {
            throw new AppError('User does not exist', 401);
        }

        // Check if user is blocked
        if (user.isBlocked) {
            throw new AppError('User is blocked', 403);
        }

        // Generate new access token only (not refresh token)
        const payload: IJWTPayload = {
            userId: user._id,
            email: user.email,
            role: user.role,
        };

        const accessToken = jwt.sign(payload, envVars.JWT_ACCESS_SECRET as jwt.Secret, {
            expiresIn: envVars.JWT_ACCESS_EXPIRES,
        } as jwt.SignOptions);

        return accessToken;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new AppError('Refresh token has expired', 401);
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new AppError('Invalid refresh token', 401);
        }
        throw error;
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
    const baseFee = 50;
    const weightFee = weight * 20;
    const distanceFee = distance ? distance * 5 : 0;

    return baseFee + weightFee + distanceFee;
};
