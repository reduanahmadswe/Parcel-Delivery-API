import { IJWTPayload } from '../utils/helpers';

declare global {
    namespace Express {
        interface Request {
            user?: IJWTPayload;
        }
    }
}

// This file only extends Express types, it doesn't replace them
export { };

