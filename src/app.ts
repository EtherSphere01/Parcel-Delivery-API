import express, { Request, Response } from "express";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import cors from "cors";
import { envVars } from "./app/config/env";

const app = express();

app.use(
    cors({
        origin: envVars.FRONT_END_URL,
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", router);
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Parcel Delivery Service",
        status: "success",
    });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
