import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import httpStatus from "http-status-codes";
import { User } from "../modules/user/user.model";

export const createUserTokens = (user: Partial<IUser>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };

    const accessToken = generateToken(
        jwtPayload,
        envVars.JWT_ACCESS_SECRET,
        envVars.JWT_ACCESS_EXPIRES
    );

    const refreshToken = generateToken(
        jwtPayload,
        envVars.JWT_REFRESH_SECRET,
        envVars.JWT_REFRESH_EXPIRES
    );

    return {
        accessToken,
        refreshToken,
    };
};

export const createNewAccessTokenWithRefresh = async (refreshToken: string) => {
    const verifiedRefreshToken = verifyToken(
        refreshToken,
        envVars.JWT_REFRESH_SECRET
    ) as JwtPayload;

    const isUserExists = await User.findOne({
        email: verifiedRefreshToken.email,
    });

    if (!isUserExists) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User does not exist", "");
    }

    if (isUserExists.isActive === IsActive.BLOCKED) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            `User is ${isUserExists.isActive}`,
            ""
        );
    }

    if (isUserExists.isDeleted) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User is deleted", "");
    }

    const jwtPayload = {
        userId: isUserExists._id,
        email: isUserExists.email,
        role: isUserExists.role,
    };

    const accessToken = generateToken(
        jwtPayload,
        envVars.JWT_ACCESS_SECRET,
        envVars.JWT_ACCESS_EXPIRES
    );

    return accessToken;
};
