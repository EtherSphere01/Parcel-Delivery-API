import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
    PORT: string;
    DB_URL: string;
}
const loadEnvVariable = (): EnvConfig => {
    const requiredEnvVars: string[] =
        [
            "PORT", "DB_URL"
        ];
    requiredEnvVars.forEach((envVar) => {
        if (!process.env[envVar]) {
            throw new Error(`Missing required environment variable: ${envVar}`);
        }
    });
    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
    };
};

export const envVars = loadEnvVariable();
