export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;
    public data?: Record<string, unknown>;

    constructor(message: string, statusCode: number, data?: Record<string, unknown>) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.data = data;

        Error.captureStackTrace(this, this.constructor);
    }
}
