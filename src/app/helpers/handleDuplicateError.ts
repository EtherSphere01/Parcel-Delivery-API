import { TGenericErrorResponse } from "../interfaces/error.types";

export const handleDuplicateError = (err: Error): TGenericErrorResponse => {
    const matchedArray = err.message.match(/"([^"]*)"/);

    return {
        statusCode: 400,
        message: `Duplicate value found for field: ${
            matchedArray ? matchedArray[1] : "unknown"
        }. Please provide a unique value.`,
    };
};
