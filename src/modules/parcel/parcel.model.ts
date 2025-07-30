import { Schema, model } from 'mongoose';
import { generateTrackingId } from '../../utils/helpers';
import { IParcel, IStatusLog } from './parcel.interface';

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

const personInfoSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
    },
    address: {
        type: addressSchema,
        required: [true, 'Address is required'],
    },
}, { _id: false });

const dimensionsSchema = new Schema({
    length: {
        type: Number,
        required: true,
        min: [0.1, 'Length must be greater than 0'],
    },
    width: {
        type: Number,
        required: true,
        min: [0.1, 'Width must be greater than 0'],
    },
    height: {
        type: Number,
        required: true,
        min: [0.1, 'Height must be greater than 0'],
    },
}, { _id: false });

const parcelDetailsSchema = new Schema({
    type: {
        type: String,
        enum: ['document', 'package', 'fragile', 'electronics', 'clothing', 'other'],
        required: [true, 'Parcel type is required'],
    },
    weight: {
        type: Number,
        required: [true, 'Weight is required'],
        min: [0.1, 'Weight must be greater than 0'],
        max: [50, 'Weight cannot exceed 50kg'],
    },
    dimensions: dimensionsSchema,
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    value: {
        type: Number,
        min: [0, 'Value cannot be negative'],
    },
}, { _id: false });

const deliveryInfoSchema = new Schema({
    preferredDeliveryDate: {
        type: Date,
        validate: {
            validator: function (date: Date) {
                return date > new Date();
            },
            message: 'Preferred delivery date must be in the future',
        },
    },
    deliveryInstructions: {
        type: String,
        trim: true,
        maxlength: [200, 'Delivery instructions cannot exceed 200 characters'],
    },
    isUrgent: {
        type: Boolean,
        default: false,
    },
}, { _id: false });

const feeSchema = new Schema({
    baseFee: {
        type: Number,
        required: true,
        min: 0,
    },
    weightFee: {
        type: Number,
        required: true,
        min: 0,
    },
    urgentFee: {
        type: Number,
        default: 0,
        min: 0,
    },
    totalFee: {
        type: Number,
        required: true,
        min: 0,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'online'],
    },
}, { _id: false });

const statusLogSchema = new Schema<IStatusLog>({
    status: {
        type: String,
        enum: ['requested', 'approved', 'dispatched', 'in-transit', 'delivered', 'cancelled', 'returned', 'flagged', 'unflagged', 'held', 'unheld', 'unblocked'],
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    updatedBy: {
        type: String,
        required: true,
    },
    updatedByType: {
        type: String,
        enum: ['admin', 'sender', 'receiver', 'system', 'delivery_agent'],
        default: 'system',
    },
    location: {
        type: String,
        trim: true,
    },
    note: {
        type: String,
        trim: true,
        maxlength: [200, 'Note cannot exceed 200 characters'],
    },
}, { _id: false });

const parcelSchema = new Schema<IParcel>({
    trackingId: {
        type: String,
        unique: true,
    },
    senderId: {
        type: String,
        required: [true, 'Sender ID is required'],
    },
    receiverId: String,
    senderInfo: {
        type: personInfoSchema,
        required: [true, 'Sender information is required'],
    },
    receiverInfo: {
        type: personInfoSchema,
        required: [true, 'Receiver information is required'],
    },
    parcelDetails: {
        type: parcelDetailsSchema,
        required: [true, 'Parcel details are required'],
    },
    deliveryInfo: {
        type: deliveryInfoSchema,
        required: [true, 'Delivery information is required'],
    },
    fee: {
        type: feeSchema,
        required: true,
    },
    currentStatus: {
        type: String,
        enum: ['requested', 'approved', 'dispatched', 'in-transit', 'delivered', 'cancelled', 'returned'],
        default: 'requested',
    },
    statusHistory: [statusLogSchema],
    assignedDeliveryPersonnel: {
        type: String,
        trim: true,
        default: null,
    },
    isFlagged: {
        type: Boolean,
        default: false,
    },
    isHeld: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    versionKey: false,
});


parcelSchema.index({ trackingId: 1 });
parcelSchema.index({ senderId: 1 });
parcelSchema.index({ receiverId: 1 });
parcelSchema.index({ currentStatus: 1 });
parcelSchema.index({ 'receiverInfo.email': 1 });
parcelSchema.index({ createdAt: -1 });


parcelSchema.pre('save', function (next) {
    // Always generate a new tracking ID if not present or if this is a retry attempt
    if (!this.trackingId || this.isNew) {
        this.trackingId = generateTrackingId();
    }

    if (!this.fee.totalFee) {
        this.fee.baseFee = 50;
        this.fee.weightFee = this.parcelDetails.weight * 20;
        this.fee.urgentFee = this.deliveryInfo.isUrgent ? 100 : 0;
        this.fee.totalFee = this.fee.baseFee + this.fee.weightFee + this.fee.urgentFee;
    }

    if (this.isNew && this.statusHistory.length === 0) {
        this.statusHistory.push({
            status: 'requested',
            timestamp: new Date(),
            updatedBy: this.senderId,
            note: 'Parcel created and requested for delivery',
        } as IStatusLog);
    }

    next();
});

export const Parcel = model<IParcel>('Parcel', parcelSchema);
