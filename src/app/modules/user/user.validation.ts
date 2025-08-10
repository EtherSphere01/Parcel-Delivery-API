import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
    name: z
        .string({
            message: "Name must be a string",
        })
        .min(2, {
            message: "Name must be at least 2 characters long",
        })
        .max(100, {
            message: "Name must be at most 100 characters long",
        }),
    email: z
        .string({
            message: "Email must be a string",
        })
        .email({
            message: "Invalid email format",
        }),
    password: z
        .string()
        .min(8, {
            message: "Password must minimum 8 character long",
        })
        .regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter",
        })
        .regex(/[a-z]/, {
            message: "Password must contain at least one lowercase letter",
        })
        .regex(/\d/, {
            message: "Password must contain at least one number",
        })
        .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, {
            message: "Password must contain at least one special character",
        }),

    phone: z
        .string({ message: "Phone must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message:
                "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        }),
    role: z.enum(Object.values(Role) as [string], {
        message: "Role must be one of SENDER, or RECEIVER",
    }),
    address: z.string({ message: "Address must be string" }).max(200, {
        message: "Address too long. Maximum 200 character long",
    }),
});

export const updateUserZodSchema = z.object({
    name: z
        .string({
            message: "Name must be a string",
        })
        .min(2, {
            message: "Name must be at least 2 characters long",
        })
        .max(100, {
            message: "Name must be at most 100 characters long",
        })
        .optional(),
    email: z
        .string({
            message: "Email must be a string",
        })
        .email({
            message: "Invalid email format",
        })
        .optional(),
    password: z
        .string()
        .min(8, {
            message: "Password must minimum 8 character long",
        })
        .regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter",
        })
        .regex(/[a-z]/, {
            message: "Password must contain at least one lowercase letter",
        })
        .regex(/\d/, {
            message: "Password must contain at least one number",
        })
        .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, {
            message: "Password must contain at least one special character",
        })
        .optional(),

    phone: z
        .string({ message: "Phone must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message:
                "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        })
        .optional(),

    address: z
        .string({ message: "Address must be string" })
        .max(200, {
            message: "Address too long. Maximum 200 character long",
        })
        .optional(),
    role: z
        .enum(Object.values(Role) as [string], {
            message: "Role must be one of SENDER, or RECEIVER",
        })
        .optional(),
    IsActive: z
        .enum(Object.values(IsActive) as [string], {
            message: "IsActive must be either ACTIVE or BLOCKED",
        })
        .optional(),
    isDeleted: z
        .boolean({
            message: "isDeleted must be a true or false value",
        })
        .optional(),
});
