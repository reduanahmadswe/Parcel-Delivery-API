/* eslint-disable no-console */
 
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;
export const catchAsync = (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
       Promise.resolve(fn(req, res, next))
        .catch((err: any) => {
            console.log('Error in async handler:', err);
            next(err);
        });
};
