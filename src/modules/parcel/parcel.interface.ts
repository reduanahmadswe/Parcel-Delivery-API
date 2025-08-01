/* eslint-disable @typescript-eslint/no-explicit-any */
import { Document } from 'mongoose';

export interface IStatusLog {
    status: 'requested' | 'approved' | 'dispatched' | 'in-transit' | 'delivered' | 'cancelled' | 'returned' | 'flagged' | 'held' | 'unflagged' | 'unheld' | 'unblocked';
    timestamp: Date;
    updatedBy: string;
    updatedByType?: 'admin' | 'sender' | 'receiver' | 'system' | 'delivery_agent';
    location?: string;
    note?: string;
}

export interface IParcel extends Document {
    _id: string;
    trackingId: string;
    senderId: string;
    receiverId: string;
    senderInfo: {
        name: string;
        email: string;
        phone: string;
        address: {
            street: string;
            city: string;
            state: string;
            zipCode: string;
            country: string;
        };
    };
    receiverInfo: {
        name: string;
        email: string;
        phone: string;
        address: {
            street: string;
            city: string;
            state: string;
            zipCode: string;
            country: string;
        };
    };
    parcelDetails: {
        type: 'document' | 'package' | 'fragile' | 'electronics' | 'clothing' | 'other';
        weight: number; // in kg
        dimensions?: {
            length: number;
            width: number;
            height: number;
        };
        description: string;
        value?: number; // estimated value
    };
    deliveryInfo: {
        preferredDeliveryDate?: Date;
        deliveryInstructions?: string;
        isUrgent: boolean;
    };
    fee: {
        baseFee: number;
        weightFee: number;
        urgentFee: number;
        totalFee: number;
        isPaid: boolean;
        paymentMethod?: 'cash' | 'card' | 'online';
    };
    currentStatus: 'requested' | 'approved' | 'dispatched' | 'in-transit' | 'delivered' | 'cancelled' | 'returned';
    statusHistory: IStatusLog[];
    assignedDeliveryPersonnel?: string;
    isFlagged: boolean;
    isHeld: boolean;
    isBlocked: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateParcel {
    receiverEmail: string; // Required receiver email - must be a valid registered user email
    receiverInfo?: { // Optional additional contact info - sender can override phone/address
        phone?: string; // Optional phone override
        address?: { // Optional address override
            street: string;
            city: string;
            state: string;
            zipCode: string;
            country: string;
        };
    };
    parcelDetails: {
        type: 'document' | 'package' | 'fragile' | 'electronics' | 'clothing' | 'other';
        weight: number;
        dimensions?: {
            length: number;
            width: number;
            height: number;
        };
        description: string;
        value?: number;
    };
    deliveryInfo: {
        preferredDeliveryDate?: Date;
        deliveryInstructions?: string;
        isUrgent: boolean;
    };
}

export interface IUpdateParcelStatus {
    status: 'approved' | 'dispatched' | 'in-transit' | 'delivered' | 'cancelled' | 'returned';
    location?: string;
    note?: string;
}

export interface IFlagParcel {
    isFlagged: boolean;
    note?: string;
}

export interface IHoldParcel {
    isHeld: boolean;
    note?: string;
}

export interface IParcelResponse {
    _id: string;
    trackingId: string;
    senderId: string;
    receiverId: string;
    senderInfo: any;
    receiverInfo: any;
    parcelDetails: any;
    deliveryInfo: any;
    fee: any;
    currentStatus: string;
    statusHistory: IStatusLog[];
    assignedDeliveryPersonnel?: string;
    isFlagged: boolean;
    isHeld: boolean;
    isBlocked: boolean;
    createdAt: Date;
    updatedAt: Date;
}
