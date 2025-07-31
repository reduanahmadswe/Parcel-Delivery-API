/* eslint-disable no-useless-escape */
import bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';
import { envVars } from '../../config/env';
import { IUser } from './user.interface';

const addressSchema = new Schema({
    street: {
        type: String,
        required: [true, 'Street address is required'],
        trim: true,
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
    },
    state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
    },
    zipCode: {
        type: String,
        required: [true, 'ZIP code is required'],
        trim: true,
    },
    country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true,
        default: 'Bangladesh',
    },
}, { _id: false });

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false,
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'],
    },
    role: {
        type: String,
        enum: ['admin', 'sender', 'receiver'],
        required: [true, 'Role is required'],
        default: 'receiver',
    },
    address: {
        type: addressSchema,
        required: [true, 'Address is required'],
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    versionKey: false,
});

// Index for better query performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ isBlocked: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const saltRounds = parseInt(envVars.BCRYPT_SALT_ROUNDS);
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (error) {
        next(error as Error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// Transform output to exclude password
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

export const User = model<IUser>('User', userSchema);
