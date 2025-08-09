import express, { Request, Response } from "express";
import expressSession from "express-session";
import { router } from "./app/routes";
import { setupSwagger } from "./swagger";

const app = express();

app.use(
    expressSession({
        secret: "your-secret-key",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", router);
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Parcel Delivery Service",
        status: "success",
    });
});

setupSwagger(app);

export default app;
