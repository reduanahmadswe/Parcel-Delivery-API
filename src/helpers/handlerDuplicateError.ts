import { TGenericErrorResponse } from '../types/error.types';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const handlerDuplicateError = (err: any): TGenericErrorResponse => {
    const matchedArray = err.message.match(/"([^"]*)"/);
    const extractedMessage = matchedArray && matchedArray[1];

    return {
        statusCode: 400,
        message: `${extractedMessage || 'Field'} already exists`,
        errorSources: [{
            path: extractedMessage || 'unknown',
            message: `${extractedMessage || 'This field'} is already taken`,
        }],
    };
};