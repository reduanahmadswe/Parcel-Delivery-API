 
import mongoose from 'mongoose';
import { TGenericErrorResponse } from '../types/error.types';

export const handleCastError = (err: mongoose.Error.CastError): TGenericErrorResponse => {
    return {
        statusCode: 400,
        message: 'Invalid MongoDB ObjectID. Please provide a valid id',
        errorSources: [{
            path: err.path,
            message: `Invalid ${err.kind}: ${err.value}`,
        }],
    };
};