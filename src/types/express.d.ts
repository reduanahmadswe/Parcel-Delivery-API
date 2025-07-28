import { IJWTPayload } from '../utils/helpers';

declare global {
    namespace Express {
        interface Request {
            user: IJWTPayload;
        }
    }
}

export { };

