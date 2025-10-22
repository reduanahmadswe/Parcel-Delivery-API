/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { AppError } from '../../utils/AppError';
import { User } from '../user/user.model';
import { ICreateParcel, IParcelResponse, IUpdateParcelStatus } from './parcel.interface';
import { Parcel } from './parcel.model';

export class ParcelService {
    // Get delivery history for receiver
    static async getReceiverDeliveryHistory(receiverId: string) {
        // Only delivered parcels for this receiver, most recent first
        return Parcel.find({ receiverId, currentStatus: 'delivered' })
            .sort({ createdAt: -1 })
            .lean();
    }
    // Create new parcel (sender only)
    static async createParcel(senderId: string, parcelData: ICreateParcel): Promise<IParcelResponse> {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Get sender information and validate sender role
            const sender = await User.findById(senderId).session(session);
            if (!sender) {
                throw new AppError('Sender not found', 404);
            }

            // Ensure only senders can create parcels
            if (sender.role !== 'sender') {
                throw new AppError('Only users with sender role can create parcels', 403);
            }

            if (sender.isBlocked) {
                throw new AppError('Your account is blocked and cannot create parcels', 403);
            }

            // Validate and find receiver by email - REQUIRED to exist in database
            const receiver = await User.findOne({ email: parcelData.receiverEmail }).session(session);
            if (!receiver) {
                throw new AppError(
                    'Validation Error',
                    400,
                    {
                        errors: [
                            {
                                path: 'receiverEmail',
                                message: 'Receiver with this email does not exist',
                            },
                        ],
                    },
                );
            }

            // Ensure receiver has receiver role
            if (receiver.role !== 'receiver') {
                throw new AppError('Selected user is not registered as a receiver', 400);
            }

            // Additional receiver validations
            if (receiver.isBlocked) {
                throw new AppError('The receiver account is blocked and cannot receive parcels', 400);
            }

            // Prevent sending parcel to self
            if (receiver._id.toString() === senderId.toString()) {
                throw new AppError('You cannot send a parcel to yourself', 400);
            }

            // Calculate fees
            const baseFee = 50; // BDT
            const weightFee = Math.ceil(parcelData.parcelDetails.weight) * 20; // 20 BDT per kg
            const urgentFee = parcelData.deliveryInfo.isUrgent ? 100 : 0; // 100 BDT for urgent
            const totalFee = baseFee + weightFee + urgentFee;

            // Create parcel with retry logic for tracking ID uniqueness
            let parcel;
            let retryCount = 0;
            const maxRetries = 5;

            while (retryCount < maxRetries) {
                try {
                    parcel = new Parcel({
                        senderId,
                        receiverId: receiver._id.toString(),
                        senderInfo: {
                            name: sender.name,
                            email: sender.email,
                            phone: sender.phone,
                            address: sender.address,
                        },
                        receiverInfo: {
                            name: receiver.name, // Always from database (non-editable)
                            email: receiver.email, // Always from database (non-editable)
                            phone: parcelData.receiverInfo?.phone || receiver.phone, // Override or default
                            address: parcelData.receiverInfo?.address || receiver.address, // Override or default
                        },
                        parcelDetails: parcelData.parcelDetails,
                        deliveryInfo: parcelData.deliveryInfo,
                        fee: {
                            baseFee,
                            weightFee,
                            urgentFee,
                            totalFee,
                            isPaid: false,
                        },
                        currentStatus: 'requested',
                        statusHistory: [{
                            status: 'requested' as any,
                            timestamp: new Date(),
                            updatedBy: senderId,
                            updatedByType: 'sender',
                            note: 'Parcel creation requested by sender',
                        }],
                        isFlagged: false,
                        isHeld: false,
                        isBlocked: false,
                    });

                    await parcel.save({ session });
                    break; // Success, exit retry loop
                } catch (error: any) {
                    if (error.code === 11000 && error.keyPattern?.trackingId) {
                        // Duplicate tracking ID error, retry with new ID
                        retryCount++;
                        if (retryCount >= maxRetries) {
                            throw new AppError('Failed to generate unique tracking ID after multiple attempts', 500);
                        }
                        // The pre-save hook will generate a new tracking ID on next attempt
                        continue;
                    }
                    throw error; // Re-throw non-duplicate errors
                }
            }

            await session.commitTransaction();
            return parcel!.toJSON();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }

    // Get parcel by ID
    static async getParcelById(id: string, userId: string, userRole: string, userEmail?: string): Promise<IParcelResponse | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid parcel ID format', 400);
        }

        const parcel = await Parcel.findById(id);
        if (!parcel) {
            throw new AppError('Parcel not found', 404);
        }

        // Check access permissions
        if (userRole !== 'admin') {
            // Convert ObjectIds to strings for proper comparison
            const parcelSenderId = parcel.senderId?.toString();
            const parcelReceiverId = parcel.receiverId?.toString();
            const userIdString = userId?.toString();

            const hasAccess = parcelSenderId === userIdString ||
                parcelReceiverId === userIdString ||
                (userEmail && parcel.receiverInfo.email === userEmail); // For email tracking

            if (!hasAccess) {
                throw new AppError('Access denied: You can only view your own parcels', 403);
            }
        }

        return parcel.toJSON();
    }

    // Get parcel by tracking ID (public access)
    static async getParcelByTrackingId(trackingId: string): Promise<IParcelResponse | null> {
        const parcel = await Parcel.findOne({ trackingId });
        if (!parcel) {
            throw new AppError('Parcel not found with this tracking ID', 404);
        }

        return parcel.toJSON();
    }

    // Get parcel status log
    static async getParcelStatusLog(id: string, userId: string, userRole: string, userEmail?: string): Promise<{ trackingId: string; statusHistory: any[] }> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid parcel ID format', 400);
        }

        const parcel = await Parcel.findById(id).select('trackingId statusHistory senderId receiverId receiverInfo.email');
        if (!parcel) {
            throw new AppError('Parcel not found', 404);
        }

        // Check access permissions
        if (userRole !== 'admin') {
            // Convert ObjectIds to strings for proper comparison
            const parcelSenderId = parcel.senderId?.toString();
            const parcelReceiverId = parcel.receiverId?.toString();
            const userIdString = userId?.toString();

            const hasAccess = parcelSenderId === userIdString ||
                parcelReceiverId === userIdString ||
                (userEmail && parcel.receiverInfo.email === userEmail); // For email tracking

            if (!hasAccess) {
                throw new AppError('Access denied: You can only view status logs of your own parcels', 403);
            }
        }

        return {
            trackingId: parcel.trackingId,
            statusHistory: parcel.statusHistory,
        };
    }

    // Get user's parcels
    static async getUserParcels(
        userId: string,
        userRole: string,
        userEmail: string,
        page = 1,
        limit = 10,
        status?: string,
        isUrgent?: boolean,
        startDate?: Date,
        endDate?: Date,
    ): Promise<{ parcels: IParcelResponse[]; totalCount: number; totalPages: number }> {
        const skip = (page - 1) * limit;
        const filter: any = {};

        // Role-based filtering
        if (userRole === 'sender') {
            filter.senderId = userId;
        } else if (userRole === 'receiver') {
            // For receivers, match against their email in receiverInfo.email
            filter['receiverInfo.email'] = userEmail;
        }

        // Additional filters
        if (status) {
            filter.currentStatus = status;
        }

        if (typeof isUrgent === 'boolean') {
            filter['deliveryInfo.isUrgent'] = isUrgent;
        }

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = startDate;
            if (endDate) filter.createdAt.$lte = endDate;
        }

        const [parcels, totalCount] = await Promise.all([
            Parcel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Parcel.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return {
            parcels: parcels.map(parcel => parcel.toJSON()),
            totalCount,
            totalPages,
        };
    }

    // Get current user's parcels without pagination
    static async getMyParcelsNoPagination(
        userId: string,
        userRole: string,
        userEmail: string,
    ): Promise<IParcelResponse[]> {
        const filter: any = {};

        // Role-based filtering
        if (userRole === 'sender') {
            filter.senderId = userId;
        } else if (userRole === 'receiver') {
            // For receivers, match against their email in receiverInfo.email
            filter['receiverInfo.email'] = userEmail;
        }

        const parcels = await Parcel.find(filter).sort({ createdAt: -1 });
        return parcels.map(parcel => parcel.toJSON());
    }

    // Get all parcels (admin only)
    static async getAllParcels(
        page = 1,
        limit = 10,
        status?: string,
        isUrgent?: boolean,
        startDate?: Date,
        endDate?: Date,
        search?: string,
        senderId?: string,
        receiverId?: string,
        senderEmail?: string,
        receiverEmail?: string,
        isFlagged?: boolean,
        isHeld?: boolean,
        isBlocked?: boolean,
    ): Promise<{ parcels: IParcelResponse[]; totalCount: number; totalPages: number }> {
        const skip = (page - 1) * limit;
        const filter: any = {};

        // Basic filters
        if (status) {
            filter.currentStatus = status;
        }

        if (typeof isUrgent === 'boolean') {
            filter['deliveryInfo.isUrgent'] = isUrgent;
        }

        if (typeof isFlagged === 'boolean') {
            filter.isFlagged = isFlagged;
        }

        if (typeof isHeld === 'boolean') {
            filter.isHeld = isHeld;
        }

        if (typeof isBlocked === 'boolean') {
            filter.isBlocked = isBlocked;
        }

        // Date range filters
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = startDate;
            if (endDate) filter.createdAt.$lte = endDate;
        }

        // Advanced search filters
        if (search) {
            // Search by tracking ID, sender name, receiver name, or description
            filter.$or = [
                { trackingId: { $regex: search, $options: 'i' } },
                { 'senderInfo.name': { $regex: search, $options: 'i' } },
                { 'receiverInfo.name': { $regex: search, $options: 'i' } },
                { 'parcelDetails.description': { $regex: search, $options: 'i' } },
            ];
        }

        // Specific user filters
        if (senderId) {
            filter.senderId = senderId;
        }

        if (receiverId) {
            filter.receiverId = receiverId;
        }

        if (senderEmail) {
            filter['senderInfo.email'] = { $regex: senderEmail, $options: 'i' };
        }

        if (receiverEmail) {
            filter['receiverInfo.email'] = { $regex: receiverEmail, $options: 'i' };
        }

        const [parcels, totalCount] = await Promise.all([
            Parcel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Parcel.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return {
            parcels: parcels.map(parcel => parcel.toJSON()),
            totalCount,
            totalPages,
        };
    }

    // Update parcel status
    static async updateParcelStatus(
        id: string,
        statusData: IUpdateParcelStatus,
        updatedBy: string,
        userRole: string,
    ): Promise<IParcelResponse> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid parcel ID format', 400);
        }

        const parcel = await Parcel.findById(id);
        if (!parcel) {
            throw new AppError('Parcel not found', 404);
        }

        // Check if parcel can be updated (not held or blocked)
        this.validateParcelCanBeUpdated(parcel);

        // Validate status transition
        this.validateStatusTransition(parcel.currentStatus, statusData.status);

        // Role-based permissions for status updates
        if (userRole === 'sender') {
            // Check if the user is the sender of this parcel
            if (parcel.senderId.toString() !== updatedBy.toString()) {
                throw new AppError('Access denied: You can only update your own parcels', 403);
            }
            // Senders can only cancel if not dispatched
            if (statusData.status !== 'cancelled' ||
                ['dispatched', 'in-transit', 'delivered', 'returned'].includes(parcel.currentStatus)) {
                throw new AppError('Senders can only cancel parcels that are not yet dispatched', 403);
            }
        } else if (userRole === 'receiver') {
            // Check if the user is the receiver of this parcel
            if (parcel.receiverId?.toString() !== updatedBy.toString()) {
                throw new AppError('Access denied: You can only update parcels addressed to you', 403);
            }
            // Block all receiver actions on returned parcels
            if (parcel.currentStatus === 'returned') {
                throw new AppError('Cannot perform actions on returned parcels', 403);
            }
            // Receivers can only confirm delivery
            if (statusData.status !== 'delivered' || parcel.currentStatus !== 'in-transit') {
                throw new AppError('Receivers can only confirm delivery of in-transit parcels', 403);
            }
        }

        // Update status
        parcel.currentStatus = statusData.status;
        parcel.statusHistory.push({
            status: statusData.status,
            timestamp: new Date(),
            updatedBy,
            location: statusData.location,
            note: statusData.note,
        });

        await parcel.save();
        return parcel.toJSON();
    }

    // Cancel parcel (sender only)
    static async cancelParcel(id: string, senderId: string, note?: string): Promise<IParcelResponse> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid parcel ID format', 400);
        }

        const parcel = await Parcel.findById(id);
        if (!parcel) {
            throw new AppError('Parcel not found', 404);
        }

        // Convert both to strings for comparison to handle ObjectId vs string mismatch
        if (parcel.senderId.toString() !== senderId.toString()) {
            throw new AppError('Access denied: You can only cancel your own parcels', 403);
        }

        // Check if parcel can be cancelled (not flagged or held)
        this.validateParcelCanBeUpdated(parcel);

        // Check if parcel can be cancelled (not dispatched yet)
        if (['dispatched', 'in-transit', 'delivered', 'returned'].includes(parcel.currentStatus)) {
            throw new AppError('Cannot cancel parcel that is already dispatched, in transit, delivered, or returned', 403);
        }

        if (parcel.currentStatus === 'cancelled') {
            throw new AppError('Parcel is already cancelled', 400);
        }

        return this.updateParcelStatus(id, {
            status: 'cancelled',
            note: note || 'Cancelled by sender',
        }, senderId, 'sender');
    }

    // Block/Unblock parcel (admin only)
    static async toggleParcelBlockStatus(id: string, isBlocked: boolean): Promise<IParcelResponse> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid parcel ID format', 400);
        }

        const parcel = await Parcel.findByIdAndUpdate(
            id,
            { isBlocked },
            { new: true, runValidators: true },
        );

        if (!parcel) {
            throw new AppError('Parcel not found', 404);
        }

        return parcel.toJSON();
    }

    // Assign delivery personnel (admin only)
    static async assignDeliveryPersonnel(id: string, deliveryPersonnel: string): Promise<IParcelResponse> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid parcel ID format', 400);
        }

        const parcel = await Parcel.findById(id);
        if (!parcel) {
            throw new AppError('Parcel not found', 404);
        }

        // Check if parcel can be updated (not flagged or held)
        this.validateParcelCanBeUpdated(parcel);

        parcel.assignedDeliveryPersonnel = deliveryPersonnel;

        // Add status log entry
        parcel.statusHistory.push({
            status: parcel.currentStatus as any,
            timestamp: new Date(),
            updatedBy: 'admin',
            note: `Delivery personnel assigned: ${deliveryPersonnel}`,
        });

        await parcel.save();
        return parcel.toJSON();
    }

    // Get parcel statistics (admin only)
    static async getParcelStats(): Promise<{
        totalParcels: number;
        requested: number;
        approved: number;
        dispatched: number;
        inTransit: number;
        delivered: number;
        cancelled: number;
        returned: number;
        urgentParcels: number;
        blockedParcels: number;
        totalRevenue: number;
    }> {
        const stats = await Parcel.aggregate([
            {
                $group: {
                    _id: null,
                    totalParcels: { $sum: 1 },
                    requested: {
                        $sum: { $cond: [{ $eq: ['$currentStatus', 'requested'] }, 1, 0] },
                    },
                    approved: {
                        $sum: { $cond: [{ $eq: ['$currentStatus', 'approved'] }, 1, 0] },
                    },
                    dispatched: {
                        $sum: { $cond: [{ $eq: ['$currentStatus', 'dispatched'] }, 1, 0] },
                    },
                    inTransit: {
                        $sum: { $cond: [{ $eq: ['$currentStatus', 'in-transit'] }, 1, 0] },
                    },
                    delivered: {
                        $sum: { $cond: [{ $eq: ['$currentStatus', 'delivered'] }, 1, 0] },
                    },
                    cancelled: {
                        $sum: { $cond: [{ $eq: ['$currentStatus', 'cancelled'] }, 1, 0] },
                    },
                    returned: {
                        $sum: { $cond: [{ $eq: ['$currentStatus', 'returned'] }, 1, 0] },
                    },
                    urgentParcels: {
                        $sum: { $cond: ['$deliveryInfo.isUrgent', 1, 0] },
                    },
                    blockedParcels: {
                        $sum: { $cond: ['$isBlocked', 1, 0] },
                    },
                    totalRevenue: {
                        $sum: { $cond: ['$fee.isPaid', '$fee.totalFee', 0] },
                    },
                },
            },
        ]);

        return stats[0] || {
            totalParcels: 0,
            requested: 0,
            approved: 0,
            dispatched: 0,
            inTransit: 0,
            delivered: 0,
            cancelled: 0,
            returned: 0,
            urgentParcels: 0,
            blockedParcels: 0,
            totalRevenue: 0,
        };
    }

    // Flag/Unflag parcel (admin only)
    static async flagParcel(id: string, isFlagged: boolean, adminId: string, note?: string): Promise<IParcelResponse> {
        const parcel = await Parcel.findById(id);
        if (!parcel) {
            throw new AppError('Parcel not found', 404);
        }

        // Add status log for flag/unflag action
        const statusLog = {
            status: isFlagged ? 'flagged' : 'unflagged',
            timestamp: new Date(),
            updatedBy: adminId,
            note: note || (isFlagged ? 'Parcel flagged by admin' : 'Parcel unflagged by admin'),
        };

        parcel.isFlagged = isFlagged;
        parcel.statusHistory.push(statusLog as any);

        await parcel.save();
        return parcel.toObject() as IParcelResponse;
    }

    // Hold/Unhold parcel (admin only)
    static async holdParcel(id: string, isHeld: boolean, adminId: string, note?: string): Promise<IParcelResponse> {
        const parcel = await Parcel.findById(id);
        if (!parcel) {
            throw new AppError('Parcel not found', 404);
        }

        // Add status log for hold/unhold action
        const statusLog = {
            status: isHeld ? 'held' : 'unheld',
            timestamp: new Date(),
            updatedBy: adminId,
            note: note || (isHeld ? 'Parcel held by admin' : 'Parcel unheld by admin'),
        };

        parcel.isHeld = isHeld;
        parcel.statusHistory.push(statusLog as any);

        await parcel.save();
        return parcel.toObject() as IParcelResponse;
    }

    // Unblock parcel (admin only)
    static async unblockParcel(id: string, adminId: string, note?: string): Promise<IParcelResponse> {
        const parcel = await Parcel.findById(id);
        if (!parcel) {
            throw new AppError('Parcel not found', 404);
        }

        // Add status log for unblock action
        const statusLog = {
            status: 'unblocked',
            timestamp: new Date(),
            updatedBy: adminId,
            note: note || 'Parcel unblocked by admin',
        };

        parcel.isBlocked = false;
        parcel.isFlagged = false; // Also unflag when unblocking
        parcel.isHeld = false; // Also unhold when unblocking
        parcel.statusHistory.push(statusLog as any);

        await parcel.save();
        return parcel.toObject() as IParcelResponse;
    }

    // Validate status transition
    private static validateStatusTransition(currentStatus: string, newStatus: string): void {
        const validTransitions: Record<string, string[]> = {
            'requested': ['approved', 'cancelled'],
            'approved': ['dispatched', 'cancelled'],
            'dispatched': ['in-transit', 'returned'],
            'in-transit': ['delivered', 'returned'],
            'delivered': [],
            'cancelled': [],
            'returned': ['dispatched'],
        };

        if (!validTransitions[currentStatus]?.includes(newStatus)) {
            throw new AppError(
                `Invalid status transition from ${currentStatus} to ${newStatus}`,
                400,
            );
        }
    }

    // Check if parcel can be updated (not flagged or held)
    private static validateParcelCanBeUpdated(parcel: any): void {
        if (parcel.isFlagged || parcel.isHeld) {
            throw new AppError('Parcel is flagged or held. No further actions allowed.', 403);
        }
        if (parcel.isBlocked) {
            throw new AppError('Cannot update status of a blocked parcel. Please unblock the parcel first.', 400);
        }
    }

    // Delete a parcel (admin only)
    static async deleteParcel(parcelId: string): Promise<void> {
        try {
            const parcel = await Parcel.findById(parcelId);

            if (!parcel) {
                throw new AppError('Parcel not found', 404);
            }

            await Parcel.findByIdAndDelete(parcelId);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError('Error deleting parcel', 500);
        }
    }

    // Return parcel (admin only)
    static async returnParcel(id: string, adminId: string, note?: string): Promise<IParcelResponse> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid parcel ID format', 400);
        }

        const parcel = await Parcel.findById(id);
        if (!parcel) {
            throw new AppError('Parcel not found', 404);
        }

        // Check if parcel can be returned (must be dispatched or in-transit)
        if (!['dispatched', 'in-transit'].includes(parcel.currentStatus)) {
            throw new AppError('Parcel can only be returned if it is dispatched or in-transit', 400);
        }

        // Check if parcel can be updated (not flagged or held)
        this.validateParcelCanBeUpdated(parcel);

        // Update status to returned
        parcel.currentStatus = 'returned';
        parcel.statusHistory.push({
            status: 'returned',
            timestamp: new Date(),
            updatedBy: adminId,
            note: note || 'Parcel returned',
        });

        await parcel.save();
        return parcel.toJSON();
    }
}
