import mongoose from 'mongoose';

// Global connection promise to avoid multiple connections
let cachedConnection: typeof mongoose | null = null;
let connectionPromise: Promise<typeof mongoose> | null = null;

const connectDB = async (): Promise<typeof mongoose> => {
    // If we have a cached connection and it's connected, return it
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    // If there's already a connection attempt in progress, wait for it
    if (connectionPromise) {
        return connectionPromise;
    }

    // Create new connection promise
    connectionPromise = (async () => {
        try {
            const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/parcel-delivery';

            // Ultra-aggressive timeout settings for serverless
            const connection = await mongoose.connect(mongoUri, {
                maxPoolSize: 1, // Single connection for serverless
                serverSelectionTimeoutMS: 2000, // 2 seconds - ultra quick fail
                socketTimeoutMS: 20000, // 20 seconds
                connectTimeoutMS: 2000, // 2 seconds - ultra quick connection
                bufferCommands: false, // Disable mongoose buffering
                heartbeatFrequencyMS: 5000, // 5 seconds heartbeat
                maxIdleTimeMS: 20000, // Close connections after 20s of inactivity
                // directConnection removed for SRV URI compatibility
            });

            cachedConnection = connection;
            console.info('✅ MongoDB connected successfully');
            return connection;

        } catch (error) {
            console.error('❌ MongoDB connection failed:', error);
            cachedConnection = null;
            connectionPromise = null; // Reset promise on failure
            throw error;
        }
    })();

    return connectionPromise;
};

export default connectDB;
