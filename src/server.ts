/* eslint-disable no-console */
import { Server } from "http";
import app from "./app";
import { envVars } from "./app/config/env";
import mongoose from "mongoose";
let server: Server;

const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL);
        console.log("Connected to MongoDB");
        server = app.listen(envVars.PORT, () => {
            console.log(`Server is running on PORT: ${envVars.PORT}`);
        });
    } catch (error) {
        console.error("Error starting the server:", error);
    }
};

(async () => {
    await startServer();
})();
