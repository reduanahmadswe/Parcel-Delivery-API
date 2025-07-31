import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/app';
import { connectDB } from '../src/config/database';

let isConnected = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Connect to database if not already connected
    if (!isConnected) {
        try {
            await connectDB();
            isConnected = true;
            console.info('Database connected for serverless function');
        } catch (error) {
            console.error('Database connection failed:', error);
            return res.status(500).json({ error: 'Database connection failed' });
        }
    }

    // Handle the request using Express app
    return app(req, res);
}
