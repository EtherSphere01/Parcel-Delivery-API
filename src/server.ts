/* eslint-disable no-console */
import { Server } from "http";
import app from "./app";
import { envVars } from "./app/config/env";
import mongoose from "mongoose";
import { seedAdmin } from "./app/utils/seedAdmin";
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
    await seedAdmin();
})();

process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection, shutting down server...", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});

process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception Rejection, shutting down server...", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});

process.on("SIGTERM", (err) => {
    console.log("SIGTERM Signal Received, shutting down server...", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
