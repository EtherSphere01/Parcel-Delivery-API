import { z } from "zod";

export const createCouponZodSchema = z.object({
    body: z.object({
        code: z
            .string({ required_error: "Coupon code is required" })
            .min(3, "Code must be at least 3 characters long"),
        discountPercentage: z
            .number({ required_error: "Discount percentage is required" })
            .int()
            .min(1, "Discount must be at least 1%")
            .max(100, "Discount cannot exceed 100%"),
        expiryDate: z
            .string({ required_error: "Expiry date is required" })
            .transform((str) => new Date(str)),
    }),
});

export const updateCouponZodSchema = createCouponZodSchema.deepPartial();
