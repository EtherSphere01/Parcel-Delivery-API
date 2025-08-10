/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleZodError } from "../helpers/handleZodError";
import { handleCastError } from "../helpers/handleCastError";
import { handleValidationError } from "../helpers/handleValidationError";

export const globalErrorHandler = async (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let message = "Internal server error";

    if (err.code === 11000) {
        const duplicateError = handleDuplicateError(err);
        statusCode = duplicateError.statusCode;
        message = duplicateError.message;
    } else if (err.name === "ZodError") {
        const zodError = handleZodError(err);
        statusCode = zodError.statusCode;
        message = zodError.message;
    } else if (err.name === "CastError") {
        const castError = handleCastError(err);
        statusCode = castError.statusCode;
        message = castError.message;
    } else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    } else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    } else if (err.name === "ValidationError") {
        const validationError = handleValidationError(err);
        statusCode = validationError.statusCode;
        message = validationError.message;
    }

    res.status(statusCode).json({
        success: false,
        message,
        err,
        stack: envVars.NODE_ENV === "development" ? err.stack : null,
    });
};
