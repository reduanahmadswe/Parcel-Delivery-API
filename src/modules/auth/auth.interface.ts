import { ICreateUser } from '../user/user.interface';

export interface IAuthResponse {
    user: {
        _id: string;
        email: string;
        name: string;
        role: string;
        isBlocked: boolean;
        isVerified: boolean;
    };
    accessToken: string;
    refreshToken: string;
}

export interface IRefreshTokenResponse {
    accessToken: string;
}

export interface IRegisterUser extends ICreateUser { }
