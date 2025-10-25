import { Response } from 'express';
import { envVars } from '../config/env';

export interface AuthTokens {
    accessToken?: string;
    refreshToken?: string;
}

/**
 * Set authentication cookies in the response
 */
export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
    const isProduction = envVars.NODE_ENV === 'production';

    if (tokenInfo.accessToken) {
        res.cookie('accessToken', tokenInfo.accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',  // ✅ 'none' for cross-origin
            maxAge: 15 * 60 * 1000, // 15 minutes
            path: '/',  // ✅ Available for all paths
        });
    }

    if (tokenInfo.refreshToken) {
        res.cookie('refreshToken', tokenInfo.refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',  // ✅ 'none' for cross-origin
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/',  // ✅ Available for all paths
        });
    }
};

/**
 * Clear authentication cookies
 */
export const clearAuthCookies = (res: Response) => {
    const isProduction = envVars.NODE_ENV === 'production';

    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
    });

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
    });
};
