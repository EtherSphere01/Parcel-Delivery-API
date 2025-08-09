import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { envVars } from "./app/config/env";

export function setupSwagger(app: Express) {
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Parcel Delivery Service API",
                version: "1.0.0",
                description: "Example API",
            },
            servers: [{ url: `http://localhost:${envVars.PORT}` }],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                },
            },
        },
        apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
    };

    const swaggerSpec = swaggerJsdoc(options);
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
