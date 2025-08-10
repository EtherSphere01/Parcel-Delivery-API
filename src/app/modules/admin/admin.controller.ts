import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { adminService } from "./admin.service";

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.getDashboardStats();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Dashboard statistics retrieved successfully",
        data: result,
    });
});

export const adminController = {
    getDashboardStats,
};
