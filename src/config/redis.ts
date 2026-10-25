import { createClient } from "redis";
import {env} from './env.js';

export const redis = createClient({
    socket: {
        host: env.REDIS_HOST,
        port: Number(env.REDIS_PORT)
    },
    password: env.REDIS_PASSWORD
    
});


redis.on('error', (err) => {
    console.error('Redis Client Error: ', err);
});

export const connectRedis = async () => {
    if(!redis.isOpen)
        await redis.connect();

    console.log('Redis connected successfully');
};

// redis://:redis2713@localhost:6379