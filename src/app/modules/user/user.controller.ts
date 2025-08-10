/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { userService } from "./user.service";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = await userService.createUser(req.body);
        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "User created successfully",
            data: user,
        });
    }
);

const getMe = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const decodedToken = req.user as JwtPayload;
        const result = await userService.getMe(decodedToken.userId);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "User retrieved successfully",
            data: result.data,
        });
    }
);
const getAllUsers = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await userService.getAllUsers();
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Users retrieved successfully",
            data: result.data,
            meta: result.meta,
        });
    }
);

const getSingleUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const result = await userService.getSingleUser(id);
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User Retrieved Successfully",
            data: result.data,
        });
    }
);

const updateUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;

        const verifiedToken = req.user;

        const payload = {
            ...req.body,
            picture: req.file?.path || "",
        };
        const user = await userService.updateUser(
            userId,
            payload,
            verifiedToken as JwtPayload
        );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "User updated successfully",
            data: user,
        });
    }
);

export const userController = {
    createUser,
    getMe,
    getAllUsers,
    getSingleUser,
    updateUser,
};
