import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { parcelService } from "./parcel.service";
import { JwtPayload } from "jsonwebtoken";

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
        const result = await parcelService.getAllParcelsByAdmin(req.query);
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
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Parcel status updated successfully",
            data: result,
        });
    }
);

const trackParcelById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { trackingId } = req.params;
        const result = await parcelService.trackParcelById(trackingId);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Parcel tracking information retrieved successfully",
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
    trackParcelById,
};
