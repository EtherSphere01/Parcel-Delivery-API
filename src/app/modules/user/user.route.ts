import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { userController } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post(
    "/register",
    validateRequest(createUserZodSchema),
    userController.createUser
);

router.get("/all-users", checkAuth(Role.ADMIN), userController.getAllUsers);
router.get("/me", checkAuth(...Object.values(Role)), userController.getMe);
router.get("/:id", checkAuth(Role.ADMIN), userController.getSingleUser);
router.patch(
    "/:id",
    validateRequest(updateUserZodSchema),
    checkAuth(...Object.values(Role)),
    userController.updateUser
);
export const UserRoutes = router;
