import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
    PORT: string;
    DB_URL: string;
    NODE_ENV: string;
    BCRYPT_SALT_ROUNDS: string;
    JWT_ACCESS_EXPIRES: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_EXPIRES: string;
    JWT_REFRESH_SECRET: string;
    FRONT_END_URL: string;
    ADMIN_EMAIL: string;
    ADMIN_PASSWORD: string;
    ADMIN_PHONE: string;
}
const loadEnvVariable = (): EnvConfig => {
    const requiredEnvVars: string[] = [
        "PORT",
        "DB_URL",
        "NODE_ENV",
        "BCRYPT_SALT_ROUNDS",
        "JWT_ACCESS_EXPIRES",
        "JWT_ACCESS_SECRET",
        "JWT_REFRESH_EXPIRES",
        "JWT_REFRESH_SECRET",
        "FRONT_END_URL",
        "ADMIN_EMAIL",
        "ADMIN_PASSWORD",
        "ADMIN_PHONE",
    ];
    requiredEnvVars.forEach((envVar) => {
        if (!process.env[envVar]) {
            throw new Error(`Missing required environment variable: ${envVar}`);
        }
    });
    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
        NODE_ENV: process.env.NODE_ENV as string,
        BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS as string,
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
        JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
        FRONT_END_URL: process.env.FRONT_END_URL as string,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,
        ADMIN_PHONE: process.env.ADMIN_PHONE as string,
    };
};

export const envVars = loadEnvVariable();
