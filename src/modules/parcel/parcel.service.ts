import mongoose from 'mongoose';
import { AppError } from '../../utils/AppError';
import { User } from '../user/user.model';
import { ICreateParcel, IParcelResponse, IUpdateParcelStatus } from './parcel.interface';
import { Parcel } from './parcel.model';

export class ParcelService {
    // Create new parcel (sender only)
    static async createParcel(senderId: string, parcelData: ICreateParcel): Promise<IParcelResponse> {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Get sender information
            const sender = await User.findById(senderId).session(session);
            if (!sender) {
                throw new AppError('Sender not found', 404);
            }

            if (sender.isBlocked) {
                throw new AppError('Your account is blocked', 403);
            }

            // Check if receiver is a registered user
            let receiverId = null;
            const receiver = await User.findOne({ email: parcelData.receiverInfo.email }).session(session);
            if (receiver) {
                if (receiver.isBlocked) {
                    throw new AppError('Receiver account is blocked', 400);
                }
                receiverId = receiver._id.toString();
            }

            // Create parcel
            const parcel = new Parcel({
                senderId,
                receiverId,
                senderInfo: {
                    name: sender.name,
                    email: sender.email,
                    phone: sender.phone,
                    address: sender.address
                },
                receiverInfo: parcelData.receiverInfo,
                parcelDetails: parcelData.parcelDetails,
                deliveryInfo: parcelData.deliveryInfo,
                fee: {
                    baseFee: 0,
                    weightFee: 0,
                    urgentFee: 0,
                    totalFee: 0,
                    isPaid: false
                }
            });

            await parcel.save({ session });
            await session.commitTransaction();

            return parcel.toJSON();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }

    // Get parcel by ID
    static async getParcelById(id: string, userId: string, userRole: string): Promise<IParcelResponse | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid parcel ID format', 400);
        }

        const parcel = await Parcel.findById(id);
        if (!parcel) {
            throw new AppError('Parcel not found', 404);
        }

        // Check access permissions
        if (userRole !== 'admin') {
            const hasAccess = parcel.senderId === userId ||
                parcel.receiverId === userId ||
                parcel.receiverInfo.email === userId; // For email tracking

            if (!hasAccess) {
                throw new AppError('Access denied', 403);
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

    // Get user's parcels
    static async getUserParcels(
        userId: string,
        userRole: string,
        userEmail: string,
        page: number = 1,
        limit: number = 10,
        status?: string,
        isUrgent?: boolean,
        startDate?: Date,
        endDate?: Date
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
            Parcel.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return {
            parcels: parcels.map(parcel => parcel.toJSON()),
            totalCount,
            totalPages
        };
    }

    // Get all parcels (admin only)
    static async getAllParcels(
        page: number = 1,
        limit: number = 10,
        status?: string,
        isUrgent?: boolean,
        startDate?: Date,
        endDate?: Date
    ): Promise<{ parcels: IParcelResponse[]; totalCount: number; totalPages: number }> {
        const skip = (page - 1) * limit;
        const filter: any = {};

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
            Parcel.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return {
            parcels: parcels.map(parcel => parcel.toJSON()),
            totalCount,
            totalPages
        };
    }

    // Update parcel status
    static async updateParcelStatus(
        id: string,
        statusData: IUpdateParcelStatus,
        updatedBy: string,
        userRole: string
    ): Promise<IParcelResponse> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid parcel ID format', 400);
        }

        const parcel = await Parcel.findById(id);
        if (!parcel) {
            throw new AppError('Parcel not found', 404);
        }

        // Validate status transition
        this.validateStatusTransition(parcel.currentStatus, statusData.status);

        // Role-based permissions for status updates
        if (userRole === 'sender') {
            // Senders can only cancel if not dispatched
            if (statusData.status !== 'cancelled' ||
                ['dispatched', 'in-transit', 'delivered'].includes(parcel.currentStatus)) {
                throw new AppError('Senders can only cancel parcels that are not yet dispatched', 403);
            }
        } else if (userRole === 'receiver') {
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
            note: statusData.note
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

        // Check if parcel can be cancelled (not dispatched yet)
        if (['dispatched', 'in-transit', 'delivered'].includes(parcel.currentStatus)) {
            throw new AppError('Cannot cancel parcel that is already dispatched or in transit', 400);
        }

        if (parcel.currentStatus === 'cancelled') {
            throw new AppError('Parcel is already cancelled', 400);
        }

        return this.updateParcelStatus(id, {
            status: 'cancelled',
            note: note || 'Cancelled by sender'
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
            { new: true, runValidators: true }
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

        const parcel = await Parcel.findByIdAndUpdate(
            id,
            { assignedDeliveryPersonnel: deliveryPersonnel },
            { new: true, runValidators: true }
        );

        if (!parcel) {
            throw new AppError('Parcel not found', 404);
        }

        // Add status log entry
        parcel.statusHistory.push({
            status: parcel.currentStatus as any,
            timestamp: new Date(),
            updatedBy: 'admin',
            note: `Delivery personnel assigned: ${deliveryPersonnel}`
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
                        $sum: { $cond: [{ $eq: ['$currentStatus', 'requested'] }, 1, 0] }
                    },
                    approved: {
                        $sum: { $cond: [{ $eq: ['$currentStatus', 'approved'] }, 1, 0] }
                    },
                    dispatched: {
                        $sum: { $cond: [{ $eq: ['$currentStatus', 'dispatched'] }, 1, 0] }
                    },
                    inTransit: {
                        $sum: { $cond: [{ $eq: ['$currentStatus', 'in-transit'] }, 1, 0] }
                    },
                    delivered: {
                        $sum: { $cond: [{ $eq: ['$currentStatus', 'delivered'] }, 1, 0] }
                    },
                    cancelled: {
                        $sum: { $cond: [{ $eq: ['$currentStatus', 'cancelled'] }, 1, 0] }
                    },
                    returned: {
                        $sum: { $cond: [{ $eq: ['$currentStatus', 'returned'] }, 1, 0] }
                    },
                    urgentParcels: {
                        $sum: { $cond: ['$deliveryInfo.isUrgent', 1, 0] }
                    },
                    blockedParcels: {
                        $sum: { $cond: ['$isBlocked', 1, 0] }
                    },
                    totalRevenue: {
                        $sum: { $cond: ['$fee.isPaid', '$fee.totalFee', 0] }
                    }
                }
            }
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
            totalRevenue: 0
        };
    }

    // Validate status transition
    private static validateStatusTransition(currentStatus: string, newStatus: string): void {
        const validTransitions: { [key: string]: string[] } = {
            'requested': ['approved', 'cancelled'],
            'approved': ['dispatched', 'cancelled'],
            'dispatched': ['in-transit', 'returned'],
            'in-transit': ['delivered', 'returned'],
            'delivered': [],
            'cancelled': [],
            'returned': ['dispatched']
        };

        if (!validTransitions[currentStatus]?.includes(newStatus)) {
            throw new AppError(
                `Invalid status transition from ${currentStatus} to ${newStatus}`,
                400
            );
        }
    }
}
