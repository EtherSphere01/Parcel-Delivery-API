import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { adminController } from "./admin.controller";

const router = Router();

router.get(
    "/dashboard-stats",
    checkAuth(Role.ADMIN),
    adminController.getDashboardStats
);

export const AdminRoutes = router;
