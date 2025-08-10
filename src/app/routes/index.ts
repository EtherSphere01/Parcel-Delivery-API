import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ParcelRoutes } from "../modules/parcel/parcel.route";
import { CouponRoutes } from "../modules/coupon/coupon.route";
import { AdminRoutes } from "../modules/admin/admin.route";
export const router = Router();

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes,
    },
    {
        path: "/auth",
        route: AuthRoutes,
    },
    {
        path: "/parcels",
        route: ParcelRoutes,
    },
    {
        path: "/coupons",
        route: CouponRoutes,
    },
    {
        path: "/admin",
        route: AdminRoutes,
    },
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
