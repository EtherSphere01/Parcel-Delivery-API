import { Parcel } from "../parcel/parcel.model";
import { User } from "../user/user.model";
import { ParcelStatus } from "../parcel/parcel.interface";

const getDashboardStats = async () => {
    const totalUsers = await User.countDocuments();
    const totalParcels = await Parcel.countDocuments();

    const deliveredParcels = await Parcel.find({
        status: ParcelStatus.DELIVERED,
    }).select("deliveryFee");

    const totalRevenue = deliveredParcels.reduce(
        (acc, parcel) => acc + parcel.deliveryFee,
        0
    );

    const parcelStatusCounts = await Parcel.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $project: { _id: 0, status: "$_id", count: 1 } },
    ]);

    const parcelsByStatus = parcelStatusCounts.reduce((acc, item) => {
        acc[item.status] = item.count;
        return acc;
    }, {});

    return {
        totalUsers,
        totalParcels,
        totalRevenue,
        parcelsByStatus,
    };
};

export const adminService = {
    getDashboardStats,
};
