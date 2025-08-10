import { Types } from "mongoose";

export enum ParcelStatus {
    REQUESTED = "REQUESTED",
    APPROVED = "APPROVED",
    DISPATCHED = "DISPATCHED",
    IN_TRANSIT = "IN_TRANSIT",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
    RETURNED = "RETURNED",
}

export interface IStatusLog {
    status: ParcelStatus;
    timestamp: Date;
    updatedBy: Types.ObjectId;
    notes?: string;
}

export interface IParcel {
    _id?: Types.ObjectId;
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    parcelDescription: string;
    weight: number;
    deliveryFee: number;
    trackingId: string;
    status: ParcelStatus;
    statusLogs: IStatusLog[];
    isBlocked?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
