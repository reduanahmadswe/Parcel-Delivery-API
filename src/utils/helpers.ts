import jwt from 'jsonwebtoken';
import { IUser } from '../modules/user/user.interface';

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

export const generateTrackingId = (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();

    return `TRK-${year}${month}${day}-${random}`;
};

export const calculateDeliveryFee = (weight: number, distance?: number): number => {
    // Base fee calculation
    const baseFee = 50; // Base fee in BDT
    const weightFee = weight * 20; // 20 BDT per kg
    const distanceFee = distance ? distance * 5 : 0; // 5 BDT per km (optional)

    return baseFee + weightFee + distanceFee;
};
