import { model, Schema } from "mongoose";
import { IParcel, IStatusLog, ParcelStatus } from "./parcel.interface";

const statusLogSchema = new Schema<IStatusLog>(
    {
        status: {
            type: String,
            enum: Object.values(ParcelStatus),
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        notes: {
            type: String,
        },
    },
    { _id: false } 
);

const parcelSchema = new Schema<IParcel>(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        parcelDescription: {
            type: String,
            required: true,
        },
        weight: {
            type: Number,
            required: true,
        },
        deliveryFee: {
            type: Number,
            required: true,
        },
        trackingId: {
            type: String,
            unique: true,
        },
        status: {
            type: String,
            enum: Object.values(ParcelStatus),
            default: ParcelStatus.REQUESTED,
        },
        statusLogs: [statusLogSchema],
        isBlocked: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

parcelSchema.pre("save", async function (next) {
    if (this.isNew) {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const randomPart = Math.floor(100000 + Math.random() * 900000);
        this.trackingId = `TRK-${year}${month}${day}-${randomPart}`;
    }
    next();
});

export const Parcel = model<IParcel>("Parcel", parcelSchema);
