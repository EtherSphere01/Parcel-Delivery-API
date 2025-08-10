import { z } from "zod";
import { ParcelStatus } from "./parcel.interface";

const createParcelZodSchema = z.object({
    body: z.object({
        receiverPhone: z
            .string({ required_error: "Receiver phone is required" })
            .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
                message: "Invalid Bangladeshi phone number format.",
            }),
        parcelDescription: z.string({
            required_error: "Parcel description is required",
        }),
        weight: z
            .number({ required_error: "Weight is required" })
            .positive("Weight must be a positive number"),
        couponCode: z.string().optional(),
    }),
});

const updateStatusZodSchema = z.object({
    body: z.object({
        status: z.enum(Object.values(ParcelStatus) as [string, ...string[]], {
            required_error: "Status is required",
        }),
        notes: z.string().optional(),
    }),
});

export const parcelValidation = {
    createParcelZodSchema,
    updateStatusZodSchema,
};
