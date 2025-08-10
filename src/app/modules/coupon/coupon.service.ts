import { Coupon } from "./coupon.model";
import { ICoupon } from "./coupon.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

const createCoupon = async (payload: ICoupon): Promise<ICoupon> => {
    const existingCoupon = await Coupon.findOne({
        code: payload.code.toUpperCase(),
    });
    if (existingCoupon) {
        throw new AppError(
            httpStatus.CONFLICT,
            "A coupon with this code already exists."
        );
    }
    const result = await Coupon.create(payload);
    return result;
};

const getAllCoupons = async (): Promise<ICoupon[]> => {
    const result = await Coupon.find().sort({ createdAt: -1 });
    return result;
};

const updateCoupon = async (
    id: string,
    payload: Partial<ICoupon>
): Promise<ICoupon | null> => {
    const result = await Coupon.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
};

const deleteCoupon = async (id: string): Promise<ICoupon | null> => {
    const result = await Coupon.findByIdAndUpdate(
        id,
        { isDeleted: true, isActive: false },
        { new: true }
    );
    return result;
};

const toggleCouponStatus = async (id: string): Promise<ICoupon | null> => {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
        throw new AppError(httpStatus.NOT_FOUND, "Coupon not found");
    }
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    return coupon;
};

const getCouponById = async (id: string): Promise<ICoupon | null> => {
    const result = await Coupon.findById(id);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Coupon not found");
    }
    return result;
};

export const couponService = {
    createCoupon,
    getAllCoupons,
    updateCoupon,
    deleteCoupon,
    toggleCouponStatus,
    getCouponById,
};
