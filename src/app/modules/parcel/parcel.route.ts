import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { parcelValidation } from "./parcel.validation";
import { parcelController } from "./parcel.controller";

const router = Router();

router.post(
    "/",
    checkAuth(Role.SENDER),
    validateRequest(parcelValidation.createParcelZodSchema),
    parcelController.createParcel
);

router.get("/me", checkAuth(Role.SENDER), parcelController.getParcelsBySender);

router.get(
    "/incoming-parcels",
    checkAuth(Role.RECEIVER),
    parcelController.getParcelsByReceiver
);

router.get(
    "/all",
    checkAuth(Role.ADMIN),
    parcelController.getAllParcelsByAdmin
);

router.patch(
    "/cancel/:id",
    checkAuth(Role.SENDER, Role.ADMIN),
    parcelController.cancelParcel
);

router.patch(
    "/update-status/:id",
    checkAuth(Role.ADMIN),
    validateRequest(parcelValidation.updateStatusZodSchema),
    parcelController.updateParcelStatus
);

export const ParcelRoutes = router;
