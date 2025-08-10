import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IsActive, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
    const { email, phone, password, role, ...restData } = payload;

    const isUserEmailExists = await User.findOne({
        email,
    });

    if (isUserEmailExists) {
        throw new AppError(
            httpStatus.CONFLICT,
            "User already exists with this email"
        );
    }
    const isUserPhoneExists = await User.findOne({
        phone,
    });
    if (isUserPhoneExists) {
        throw new AppError(
            httpStatus.CONFLICT,
            "User already exists with this phone number"
        );
    }

    if (role === "ADMIN") {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "You cannot create a user with ADMIN role"
        );
    }

    const hashedPassword = await bcryptjs.hash(
        password as string,
        parseInt(envVars.BCRYPT_SALT_ROUNDS)
    );
    const user = await User.create({
        email,
        phone,
        role,
        password: hashedPassword,
        ...restData,
    });
    return user;
};
const getAllUsers = async () => {
    const users = await User.find({});

    const totalUsers = await User.countDocuments();
    return {
        data: users,
        meta: {
            page: 1,
            limit: totalUsers,
            total: totalUsers,
            totalPage: 1,
        },
    };
};

const getSingleUser = async (id: string) => {
    const user = await User.findById(id).select("-password");
    return {
        data: user,
    };
};

const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    return {
        data: user,
    };
};

const updateUser = async (
    userId: string,
    payload: Partial<IUser>,
    decodedToken: JwtPayload
) => {
    if (
        decodedToken.role === Role.RECEIVER ||
        decodedToken.role === Role.SENDER
    ) {
        if (userId !== decodedToken.useId) {
            throw new AppError(
                httpStatus.FORBIDDEN,
                "You are not Authorized to update this user",
                ""
            );
        }
    }

    const isUserExists = await User.findById(userId);
    if (!isUserExists) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found", "");
    }

    if (payload.role) {
        if (
            decodedToken.role === Role.SENDER ||
            decodedToken.role === Role.RECEIVER
        ) {
            throw new AppError(
                httpStatus.FORBIDDEN,
                "You are not Authorized",
                ""
            );
        }
    }

    if (payload.isActive || payload.isDeleted) {
        if (
            decodedToken.role === Role.SENDER ||
            decodedToken.role === Role.RECEIVER
        ) {
            throw new AppError(
                httpStatus.FORBIDDEN,
                "You are not Authorized",
                ""
            );
        }
    }

    if (payload.isDeleted) {
        payload.isActive = IsActive.BLOCKED;
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });

    return newUpdatedUser;
};

export const userService = {
    createUser,
    getAllUsers,
    getSingleUser,
    getMe,
    updateUser,
};
