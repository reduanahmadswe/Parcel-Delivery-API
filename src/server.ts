/* eslint-disable no-console */
import { Server } from 'http';
import app from './app';
import { connectDB } from './config/database';
import { envVars } from './config/env';

let server: Server;

// Start server
const PORT = envVars.PORT;

const startServer = async () => {
    await connectDB();

    server = app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📊 Environment: ${envVars.NODE_ENV}`);
        console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    });

    return server;
};

// Start the application
(async () => {
    await startServer();
})();
/**
 * Process event handlers for graceful shutdown
 */

// Unhandled promise rejection
process.on('unhandledRejection', (error) => {
    console.log('Unhandled rejection detected .. server shutting down..', error);

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }

    process.exit(1);
});

// Uncaught exception
process.on('uncaughtException', (error) => {
    console.log('Uncaught exception detected... server shutting down..', error);

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }

    process.exit(1);
});

// Graceful shutdown (SIGTERM)
process.on('SIGTERM', (error) => {
    console.log('SIGTERM signal received... server shutting down..', error);

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }

    process.exit(1);
});

//export { app, server };
//export default app;

