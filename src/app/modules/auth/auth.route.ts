import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post("/login", AuthController.login);
router.post("/refresh-token", AuthController.getNewAccessToken);
router.post("/logout", AuthController.logout);
router.post(
    "/change-password",
    checkAuth(...Object.values(Role)),
    AuthController.changePassword
);

export const AuthRoutes = router;
