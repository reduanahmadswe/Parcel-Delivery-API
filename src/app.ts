/* eslint-disable quotes */
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import connectDB from './config/database';

import { globalErrorHandler } from './middlewares/globalErrorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { router } from './routes';

const app = express();
// CORS configuration
const allowedOrigins = [
    "https://parcel-delivery-frontend.onrender.com", // frontend on Render
    "http://localhost:5173",
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true, // important for cookies / tokens
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check - fast response without waiting for DB
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Parcel Delivery API is running successfully',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    });
});

// Health check endpoint specifically for monitoring
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    });
});

// Database connection middleware - OPTIMIZED VERSION
app.use('/api', async (req, res, next) => {
    // Skip database check for OPTIONS requests (CORS preflight)
    if (req.method === 'OPTIONS') {
        return next();
    }

    // If DB is already connected, continue immediately
    if (mongoose.connection.readyState === 1) {
        return next();
    }

    // Only try to connect if not connected
    const timeout = setTimeout(() => {
        if (!res.headersSent) {
            console.error('⚠️ Database connection timeout');
            res.status(503).json({
                success: false,
                message: 'Service temporarily unavailable - database connection timeout',
                error: 'DATABASE_TIMEOUT',
                timestamp: new Date().toISOString(),
            });
        }
    }, 5000); // Reduced to 5 seconds

    try {
        await connectDB();
        clearTimeout(timeout);
        next();
    } catch (error) {
        clearTimeout(timeout);

        if (!res.headersSent) {
            console.error('❌ Database connection failed:', error);
            res.status(503).json({
                success: false,
                message: 'Service temporarily unavailable - database connection failed',
                error: error instanceof Error ? error.message : 'DATABASE_ERROR',
                timestamp: new Date().toISOString(),
            });
        }
    }
});

// API Routes
app.use('/api', router);

// Error handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
