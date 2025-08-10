import { Types } from "mongoose";

export enum Role {
    ADMIN = "ADMIN",
    SENDER = "SENDER",
    RECEIVER = "RECEIVER",
}

export enum IsActive {
    ACTIVE = "ACTIVE",
    BLOCKED = "BLOCKED",
}

export interface IUser {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    phone: string;
    role: Role;
    address: string;
    isActive?: IsActive;
    isDeleted?: boolean;
    createdAt?: Date;
}
