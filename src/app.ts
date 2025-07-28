import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { router } from './routes';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api', router);

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Parcel Delivery API is running successfully',
        timestamp: new Date().toISOString()
    });
});

// Error handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;