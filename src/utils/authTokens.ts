import { Response } from 'express';

export interface AuthTokens {
    accessToken?: string;
    refreshToken?: string;
}

/**
 * Set authentication cookies in the response
 */
export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
    if (tokenInfo.accessToken) {
        res.cookie('accessToken', tokenInfo.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
    }

    if (tokenInfo.refreshToken) {
        res.cookie('refreshToken', tokenInfo.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
    }
};

/**
 * Clear authentication cookies
 */
export const clearAuthCookies = (res: Response) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
};
