import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { couponService } from "./coupon.service";

const createCoupon = catchAsync(async (req: Request, res: Response) => {
    const result = await couponService.createCoupon(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Coupon created successfully",
        data: result,
    });
});

const getAllCoupons = catchAsync(async (req: Request, res: Response) => {
    const result = await couponService.getAllCoupons();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Coupons retrieved successfully",
        data: result,
    });
});

const updateCoupon = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await couponService.updateCoupon(id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Coupon updated successfully",
        data: result,
    });
});

const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await couponService.deleteCoupon(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Coupon deleted successfully",
        data: null,
    });
});

const toggleCouponStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await couponService.toggleCouponStatus(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Coupon status updated successfully",
        data: result,
    });
});

const getCouponById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await couponService.getCouponById(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Coupon retrieved successfully",
        data: result,
    });
});

export const couponController = {
    createCoupon,
    getAllCoupons,
    updateCoupon,
    deleteCoupon,
    toggleCouponStatus,
    getCouponById,
};
