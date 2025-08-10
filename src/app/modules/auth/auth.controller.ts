/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { setAuthCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import { createUserTokens } from "../../utils/userTokens";
import { IsActive } from "../user/user.interface";

const login = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = await authService.login(req.body);
        if (!user) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                "Invalid email or password",
                ""
            );
        }
        if (user.isActive === IsActive.BLOCKED) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                `User is ${user.isActive}`,
                ""
            );
        }
        if (user.isDeleted) {
            throw new AppError(httpStatus.UNAUTHORIZED, "User is deleted", "");
        }
        const userTokens = createUserTokens(user);
        const { password: pass, ...userData } = user.toObject();
        setAuthCookie(res, userTokens);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "User logged in successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: userData,
            },
        });
    }
);

const getNewAccessToken = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "Refresh token is missing",
                ""
            );
        }

        const tokenInfo = await authService.getNewAccessToken(refreshToken);

        setAuthCookie(res, tokenInfo);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "New Access token retrieve successful",
            data: tokenInfo,
        });
    }
);

const logout = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Logout successful",
            data: null,
        });
    }
);

const changePassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const decodedToken = req.user;

        await authService.changePassword(
            oldPassword,
            newPassword,
            decodedToken as JwtPayload
        );

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Password change successful",
            data: null,
        });
    }
);

export const AuthController = {
    login,
    getNewAccessToken,
    logout,
    changePassword,
};
