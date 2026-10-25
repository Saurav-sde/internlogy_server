import {z} from 'zod';
import 'dotenv/config';

const envSchema = z.object({

    BACKEND_PORT: z.string(),

    DATABASE_URL: z.string().url(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_CALLBACK_URL: z.string().url(),

    FRONTEND_URL: z.string().url(),
    BACKEND_URL: z.string().url(),

    JWT_SECRET: z.string().min(1),

    REDIS_PORT: z.string(),
    REDIS_HOST: z.string(),
    REDIS_PASSWORD: z.string(),

})

const result = envSchema.safeParse(process.env);
if (!result.success) {
    console.error("Invalid environment variables:", result.error.flatten());
    throw new Error("Environment variable validation failed");
}
export const env = result.data;

