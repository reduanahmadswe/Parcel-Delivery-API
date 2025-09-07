import serverless from 'serverless-http';
import app from '../src/app';

// Configure serverless-http with optimized settings
const handler = serverless(app, {
    binary: ['image/*', 'application/pdf', 'application/octet-stream'],
});

export default handler;
