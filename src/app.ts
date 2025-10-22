import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import connectDB from './config/database';
import { envVars } from './config/env';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { router } from './routes';

const app = express();

// Trust proxy for Vercel
app.set('trust proxy', 1);

// CORS Configuration
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://parcel-delivery-frontend.onrender.com',
];

// Add FRONTEND_URL from environment if it exists
if (envVars.FRONTEND_URL) {
    allowedOrigins.push(envVars.FRONTEND_URL);
}

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn('Blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-refresh-token'],
    exposedHeaders: ['x-refresh-token'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
}));

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

// Database connection middleware for API routes only  
app.use('/api', async (req, res, next) => {
    // Set a very aggressive timeout for API requests
    const timeout = setTimeout(() => {
        if (!res.headersSent) {
            res.status(408).json({
                success: false,
                message: 'API request timeout - database connection failed',
                error: 'Database connection timeout',
                timestamp: new Date().toISOString(),
            });
        }
    }, 8000); // 8 second timeout for API routes

    try {
        await connectDB();
        clearTimeout(timeout);
        next();
    } catch (error) {
        clearTimeout(timeout);

        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: 'Database connection failed',
                error: error instanceof Error ? error.message : 'Unknown error',
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
