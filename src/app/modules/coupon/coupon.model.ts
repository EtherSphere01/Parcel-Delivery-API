import { model, Schema } from "mongoose";
import { ICoupon } from "./coupon.interface";

const couponSchema = new Schema<ICoupon>(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
        },
        discountPercentage: {
            type: Number,
            required: true,
            min: 1,
            max: 100,
        },
        expiryDate: {
            type: Date,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

couponSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

export const Coupon = model<ICoupon>("Coupon", couponSchema);
