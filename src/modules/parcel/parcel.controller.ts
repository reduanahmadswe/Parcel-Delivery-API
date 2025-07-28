import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import { ParcelService } from './parcel.service';

export class ParcelController {
    // Create new parcel (sender only)
    static async createParcel(req: Request, res: Response, next: NextFunction) {
        try {
            const senderId = (req as any).user.userId;
            const parcelData = req.body;

            const parcel = await ParcelService.createParcel(senderId, parcelData);

            res.status(201).json({
                success: true,
                message: 'Parcel created successfully',
                data: parcel
            });
        } catch (error) {
            next(error);
        }
    }

    // Get parcel by ID
    static async getParcelById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const userId = (req as any).user.userId;
            const userRole = (req as any).user.role;

            const parcel = await ParcelService.getParcelById(id, userId, userRole);

            res.status(200).json({
                success: true,
                message: 'Parcel retrieved successfully',
                data: parcel
            });
        } catch (error) {
            next(error);
        }
    }

    // Get parcel by tracking ID (public)
    static async getParcelByTrackingId(req: Request, res: Response, next: NextFunction) {
        try {
            const { trackingId } = req.params;
            const parcel = await ParcelService.getParcelByTrackingId(trackingId);

            res.status(200).json({
                success: true,
                message: 'Parcel tracking information retrieved successfully',
                data: parcel
            });
        } catch (error) {
            next(error);
        }
    }

    // Get current user's parcels
    static async getMyParcels(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.userId;
            const userRole = (req as any).user.role;
            const { page, limit, status, isUrgent, startDate, endDate } = req.query as any;

            const result = await ParcelService.getUserParcels(
                userId,
                userRole,
                page,
                limit,
                status,
                isUrgent,
                startDate,
                endDate
            );

            res.status(200).json({
                success: true,
                message: 'Parcels retrieved successfully',
                data: result.parcels,
                pagination: {
                    currentPage: page || 1,
                    totalPages: result.totalPages,
                    totalCount: result.totalCount,
                    limit: limit || 10
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // Get all parcels (admin only)
    static async getAllParcels(req: Request, res: Response, next: NextFunction) {
        try {
            const { page, limit, status, isUrgent, startDate, endDate } = req.query as any;

            const result = await ParcelService.getAllParcels(
                page,
                limit,
                status,
                isUrgent,
                startDate,
                endDate
            );

            res.status(200).json({
                success: true,
                message: 'All parcels retrieved successfully',
                data: result.parcels,
                pagination: {
                    currentPage: page || 1,
                    totalPages: result.totalPages,
                    totalCount: result.totalCount,
                    limit: limit || 10
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // Update parcel status
    static async updateParcelStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const statusData = req.body;
            const updatedBy = (req as any).user.userId;
            const userRole = (req as any).user.role;

            const parcel = await ParcelService.updateParcelStatus(id, statusData, updatedBy, userRole);

            res.status(200).json({
                success: true,
                message: 'Parcel status updated successfully',
                data: parcel
            });
        } catch (error) {
            next(error);
        }
    }

    // Cancel parcel (sender only)
    static async cancelParcel(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const senderId = (req as any).user.userId;
            const { note } = req.body;

            const parcel = await ParcelService.cancelParcel(id, senderId, note);

            res.status(200).json({
                success: true,
                message: 'Parcel cancelled successfully',
                data: parcel
            });
        } catch (error) {
            next(error);
        }
    }

    // Block/Unblock parcel (admin only)
    static async toggleParcelBlockStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { isBlocked } = req.body;

            if (typeof isBlocked !== 'boolean') {
                throw new AppError('isBlocked must be a boolean value', 400);
            }

            const parcel = await ParcelService.toggleParcelBlockStatus(id, isBlocked);

            res.status(200).json({
                success: true,
                message: `Parcel ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
                data: parcel
            });
        } catch (error) {
            next(error);
        }
    }

    // Get parcel statistics (admin only)
    static async getParcelStats(req: Request, res: Response, next: NextFunction) {
        try {
            const stats = await ParcelService.getParcelStats();

            res.status(200).json({
                success: true,
                message: 'Parcel statistics retrieved successfully',
                data: stats
            });
        } catch (error) {
            next(error);
        }
    }

    // Confirm delivery (receiver only)
    static async confirmDelivery(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const receiverId = (req as any).user.userId;
            const { note } = req.body;

            const parcel = await ParcelService.updateParcelStatus(
                id,
                {
                    status: 'delivered',
                    note: note || 'Delivery confirmed by receiver'
                },
                receiverId,
                'receiver'
            );

            res.status(200).json({
                success: true,
                message: 'Delivery confirmed successfully',
                data: parcel
            });
        } catch (error) {
            next(error);
        }
    }
}
