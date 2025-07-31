import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { envVars } from './config/env';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { router } from './routes';

const app = express();

// Middleware
app.use(cors({
    origin: envVars.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// Health check
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Parcel Delivery API is running successfully',
        timestamp: new Date().toISOString(),
    });
});

// Routes
app.use('/api', router);


// Error handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;