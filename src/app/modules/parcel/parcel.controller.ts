import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { parcelService } from "./parcel.service";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";

const createParcel = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await parcelService.createParcel(
            req.body,
            req.user as JwtPayload
        );
        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "Parcel creation request sent successfully",
            data: result,
        });
    }
);

const getAllParcelsByAdmin = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await parcelService.getAllParcelsByAdmin();
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "All parcels retrieved successfully",
            data: result,
        });
    }
);

const getParcelsBySender = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await parcelService.getParcelsBySender(
            (req.user as JwtPayload).userId
        );
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Your parcels retrieved successfully",
            data: result,
        });
    }
);

const getParcelsByReceiver = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await parcelService.getParcelsByReceiver(
            req.user as JwtPayload
        );
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Incoming parcels retrieved successfully",
            data: result,
        });
    }
);

const cancelParcel = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const result = await parcelService.cancelParcel(
            id,
            req.user as JwtPayload
        );
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Parcel cancelled successfully",
            data: result,
        });
    }
);

const updateParcelStatus = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { status, notes } = req.body;
        const result = await parcelService.updateParcelStatus(
            id,
            status,
            notes,
            (req.user as JwtPayload).userId
        );
        if (result.isBlocked) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "Parcel is cancelled and cannot be updated",
                ""
            );
        }
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Parcel status updated successfully",
            data: result,
        });
    }
);

export const parcelController = {
    createParcel,
    getAllParcelsByAdmin,
    getParcelsBySender,
    getParcelsByReceiver,
    cancelParcel,
    updateParcelStatus,
};
