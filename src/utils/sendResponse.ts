import { Response } from "express";

interface TMeta {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
}

interface TResponse<T> {
    statuscode: number;
    success: boolean;
    message: string;
    data: T;
    meta?: TMeta
}

export const sendResponse = <T>(res: Response, data: TResponse<T>) => {

    res.status(data.statuscode).json({
        statusCode: data.statuscode,
        success: data.success,
        message: data.message,
        meta: data.meta,
        data: data.data
    })
}