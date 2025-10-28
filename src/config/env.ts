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

    if (process.env.FRONTEND_URL) {
        config.FRONTEND_URL = process.env.FRONTEND_URL;
    }

    return config;
};

export const envVars = loadEnvVariables();
