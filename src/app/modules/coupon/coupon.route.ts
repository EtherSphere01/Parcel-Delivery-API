import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import {
    createCouponZodSchema,
    updateCouponZodSchema,
} from "./coupon.validation";
import { couponController } from "./coupon.controller";

const router = Router();

router.post(
    "/",
    checkAuth(Role.ADMIN),
    validateRequest(createCouponZodSchema),
    couponController.createCoupon
);

router.get("/", checkAuth(Role.ADMIN), couponController.getAllCoupons);

router.get("/:id", checkAuth(Role.ADMIN), couponController.getCouponById);

router.patch(
    "/:id",
    checkAuth(Role.ADMIN),
    validateRequest(updateCouponZodSchema),
    couponController.updateCoupon
);

router.patch(
    "/toggle-status/:id",
    checkAuth(Role.ADMIN),
    couponController.toggleCouponStatus
);

router.delete("/:id", checkAuth(Role.ADMIN), couponController.deleteCoupon);

export const CouponRoutes = router;
