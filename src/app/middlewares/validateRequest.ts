import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import { catchAsync } from "../utils/catchAsync";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";

export const validateRequest = (schema: AnyZodObject) => {
    return catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    "Request body is missing or empty. Please ensure you are sending a raw JSON body with the 'Content-Type: application/json' header."
                );
            }
            await schema.parseAsync({
                body: req.body,
                cookies: req.cookies,
                params: req.params,
                query: req.query,
            });

            next();
        }
    );
};
