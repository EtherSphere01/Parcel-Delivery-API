import AppError from "../../errorHelpers/AppError";
import { IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import {
    createNewAccessTokenWithRefresh,
    createUserTokens,
} from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";

const login = async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    const isUserExist = await User.findOne({ email });
    if (!isUserExist) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            "User does not exist with this email"
        );
    }
    if (isUserExist.isActive === IsActive.BLOCKED) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            `User is ${isUserExist.isActive}`,
            ""
        );
    }
    if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User is deleted", "");
    }

    const isPasswordMatch = await bcrypt.compare(
        password as string,
        isUserExist.password as string
    );
    if (!isPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Password is incorrect");
    }

    return isUserExist;
};

const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefresh(refreshToken);
    return {
        accessToken: newAccessToken,
    };
};

const changePassword = async (
    oldPassword: string,
    newPassword: string,
    decodedToken: JwtPayload
) => {
    const user = await User.findById(decodedToken.userId);
    if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User does not exist", "");
    }
    const isOldPasswordMatch = await bcrypt.compare(
        oldPassword,
        user.password as string
    );
    if (!isOldPasswordMatch) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            "Old password is incorrect",
            ""
        );
    }

    const hashedNewPassword = await bcrypt.hash(
        newPassword,
        parseInt(envVars.BCRYPT_SALT_ROUNDS)
    );
    user.password = hashedNewPassword;
    await user.save();
};

export const authService = {
    login,
    getNewAccessToken,
    changePassword,
};
