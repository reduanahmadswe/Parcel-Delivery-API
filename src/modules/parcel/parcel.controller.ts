import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { ParcelService } from './parcel.service';

export class ParcelController {
    // Create new parcel (sender only)
    static createParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const senderId = (req as any).user.userId;
        const parcelData = req.body;

        const parcel = await ParcelService.createParcel(senderId, parcelData);

        sendResponse(res, {
            statuscode: 201,
            success: true,
            message: 'Parcel created successfully',
            data: parcel
        });
    });

    // Get parcel by ID
    static getParcelById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const userId = (req as any).user.userId;
        const userRole = (req as any).user.role;

        const parcel = await ParcelService.getParcelById(id, userId, userRole);

        sendResponse(res, {
            statuscode: 200,
            success: true,
            message: 'Parcel retrieved successfully',
            data: parcel
        });
    });

    // Get parcel by tracking ID (public)
    static getParcelByTrackingId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { trackingId } = req.params;
        const parcel = await ParcelService.getParcelByTrackingId(trackingId);

        sendResponse(res, {
            statuscode: 200,
            success: true,
            message: 'Parcel tracking information retrieved successfully',
            data: parcel
        });
    });

    // Get current user's parcels
    static getMyParcels = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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

        sendResponse(res, {
            statuscode: 200,
            success: true,
            message: 'Parcels retrieved successfully',
            data: result.parcels,
            meta: {
                page: page || 1,
                limit: limit || 10,
                total: result.totalCount,
                totalPages: result.totalPages
            }
        });
    });

    // Get all parcels (admin only)
    static getAllParcels = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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
    });

    // Update parcel status
    static updateParcelStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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
    });

    // Cancel parcel (sender only)
    static cancelParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const senderId = (req as any).user.userId;
        const { note } = req.body;

        const parcel = await ParcelService.cancelParcel(id, senderId, note);

        res.status(200).json({
            success: true,
            message: 'Parcel cancelled successfully',
            data: parcel
        });
    });

    // Block/Unblock parcel (admin only)
    static toggleParcelBlockStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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
    });

    // Get parcel statistics (admin only)
    static getParcelStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const stats = await ParcelService.getParcelStats();

        res.status(200).json({
            success: true,
            message: 'Parcel statistics retrieved successfully',
            data: stats
        });
    });

    // Confirm delivery (receiver only)
    static confirmDelivery = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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
    });
}
