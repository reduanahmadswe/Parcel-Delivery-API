import { Document } from 'mongoose';

export interface IUser extends Document {
    _id: string;
    email: string;
    password: string;
    name: string;
    phone: string;
    role: 'admin' | 'sender' | 'receiver';
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    isBlocked: boolean;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserResponse {
    _id: string;
    email: string;
    name: string;
    phone: string;
    role: 'admin' | 'sender' | 'receiver';
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    isBlocked: boolean;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateUser {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: 'sender' | 'receiver';
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
}

export interface IUpdateUser {
    name?: string;
    phone?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
    };
}

export interface ILoginUser {
    email: string;
    password: string;
}
