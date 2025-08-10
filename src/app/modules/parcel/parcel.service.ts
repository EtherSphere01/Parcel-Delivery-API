import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IParcel, ParcelStatus } from "./parcel.interface";
import { Parcel } from "./parcel.model";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";
import { Coupon } from "../coupon/coupon.model";

import { Types } from "mongoose";
import { Role } from "../user/user.interface";

const calculateFee = (weight: number): number => {
    return 50 + weight * 10;
};

const createParcel = async (
    payload: {
        receiverPhone: string;
        parcelDescription: string;
        weight: number;
        couponCode?: string;
    },
    senderInfo: JwtPayload
) => {
    const { receiverPhone, weight, couponCode } = payload;
    const receiverUser = await User.findOne({ phone: receiverPhone });
    if (!receiverUser) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "Receiver not found. No user is registered with this phone number."
        );
    }

    if (
        receiverUser.role !== Role.RECEIVER &&
        receiverUser.role !== Role.ADMIN
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Invalid receiver. Parcels can only be sent to users with the 'RECEIVER' role."
        );
    }

    if (senderInfo.userId === receiverUser._id.toString()) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "You cannot send a parcel to yourself."
        );
    }

    if (!weight) {
        throw new AppError(httpStatus.BAD_REQUEST, "Weight is required");
    }

    let deliveryFee = calculateFee(weight);

    if (couponCode) {
        const coupon = await Coupon.findOne({
            code: couponCode,
            isActive: true,
        });

        if (coupon && coupon.expiryDate > new Date()) {
            const discountAmount =
                (deliveryFee * coupon.discountPercentage) / 100;
            deliveryFee -= discountAmount;
        } else {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "The provided coupon code is invalid or has expired."
            );
        }
    }

    const initialStatusLog = {
        status: ParcelStatus.REQUESTED,
        timestamp: new Date(),
        updatedBy: new Types.ObjectId(senderInfo.userId),
    };

    const newParcel = await Parcel.create({
        ...payload,
        sender: senderInfo.userId,
        receiver: receiverUser._id,
        deliveryFee,
        status: ParcelStatus.REQUESTED,
        statusLogs: [initialStatusLog],
    });

    return newParcel;
};

const getAllParcelsByAdmin = async () => {
    const parcels = await Parcel.find({})
        .populate("sender", "name email phone")
        .sort({ createdAt: -1 });
    return parcels;
};

const getParcelsBySender = async (senderId: string) => {
    const parcels = await Parcel.find({ sender: senderId }).sort({
        createdAt: -1,
    });
    return parcels;
};

const getParcelsByReceiver = async (userInfo: JwtPayload) => {
    const parcels = await Parcel.find({ receiver: userInfo.userId })
        .populate("sender", "name phone")
        .sort({ createdAt: -1 });
    return parcels;
};

const cancelParcel = async (parcelId: string, userInfo: JwtPayload) => {
    const parcel = await Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    }

    const isOwner = parcel.sender.toString() === userInfo.userId;

    const isAdmin = userInfo.role === Role.ADMIN;

    if (!isOwner && !isAdmin) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            "You are not authorized to cancel this parcel"
        );
    }

    if (
        parcel.status !== ParcelStatus.REQUESTED &&
        parcel.status !== ParcelStatus.APPROVED
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Cannot cancel a parcel with status '${parcel.status}'`
        );
    }

    parcel.status = ParcelStatus.CANCELLED;
    parcel.statusLogs.push({
        status: ParcelStatus.CANCELLED,
        timestamp: new Date(),
        updatedBy: new Types.ObjectId(userInfo.userId),
        notes: "Cancelled by user.",
    });

    await parcel.save();

    return parcel;
};

const updateParcelStatus = async (
    parcelId: string,
    status: ParcelStatus,
    notes: string | undefined,
    adminId: string
) => {
    const parcel = await Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    }

    if (parcel.status === "CANCELLED") {
        parcel.isBlocked = true;
        await parcel.save();
        return parcel;
    }
    parcel.status = status;
    parcel.statusLogs.push({
        status,
        timestamp: new Date(),
        updatedBy: new Types.ObjectId(adminId),
        notes,
    });

    await parcel.save();
    return parcel;
};

export const parcelService = {
    createParcel,
    getAllParcelsByAdmin,
    getParcelsBySender,
    getParcelsByReceiver,
    cancelParcel,
    updateParcelStatus,
};
