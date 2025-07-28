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
    token: string;
}

export interface IRegisterUser extends ICreateUser { }
