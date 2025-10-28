import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
    NODE_ENV: 'development' | 'production';
    PORT: string;
    MONGODB_URI: string;

    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;

    JWT_ACCESS_SECRET: string;
    JWT_ACCESS_EXPIRES: string;

    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRES: string;

    BCRYPT_SALT_ROUNDS: string;
    FRONTEND_URL?: string;
    // Optional email configuration (used by emailService)
    EMAIL_HOST?: string;
    EMAIL_PORT?: string;
    EMAIL_SECURE?: string; // 'true' or 'false'
    EMAIL_USER?: string;
    EMAIL_PASSWORD?: string;
    EMAIL_FROM?: string;
    EMAIL_FROM_NAME?: string;
}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariables: string[] = [
        'NODE_ENV',
        'PORT',
        'MONGODB_URI',
        'JWT_SECRET',
        'JWT_EXPIRES_IN',
        'JWT_ACCESS_SECRET',
        'JWT_ACCESS_EXPIRES',
        'JWT_REFRESH_SECRET',
        'JWT_REFRESH_EXPIRES',
        'BCRYPT_SALT_ROUNDS',
    ];

    requiredEnvVariables.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
    });

    const config: EnvConfig = {
        NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
        PORT: process.env.PORT as string,
        MONGODB_URI: process.env.MONGODB_URI as string,

        JWT_SECRET: process.env.JWT_SECRET as string,
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,

        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,

        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
        JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,

        BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS as string,
    };

    // Optional email env vars — only included if present so app can start without email config
    if (process.env.EMAIL_HOST) config.EMAIL_HOST = process.env.EMAIL_HOST;
    if (process.env.EMAIL_PORT) config.EMAIL_PORT = process.env.EMAIL_PORT;
    if (process.env.EMAIL_SECURE) config.EMAIL_SECURE = process.env.EMAIL_SECURE;
    if (process.env.EMAIL_USER) config.EMAIL_USER = process.env.EMAIL_USER;
    if (process.env.EMAIL_PASSWORD) config.EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
    if (process.env.EMAIL_FROM) config.EMAIL_FROM = process.env.EMAIL_FROM;
    if (process.env.EMAIL_FROM_NAME) config.EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME;

    if (process.env.FRONTEND_URL) {
        config.FRONTEND_URL = process.env.FRONTEND_URL;
    }

    return config;
};

export const envVars = loadEnvVariables();
