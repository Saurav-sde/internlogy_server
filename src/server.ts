import "dotenv/config"
import app from "./app.js"
import prisma from "./config/prisma.js";
import { connectRedis } from "./config/redis.js";




const PORT = Number(process.env.PORT) || 8000;


const startServer = async() => {
    try {
        await Promise.all([prisma.$connect(), connectRedis()]);
        console.log("DB connected");

        app.listen(PORT, () => {
            console.log(`Server is Listening at port: ${PORT}`)
        })
    } catch (error) {
        console.log("Failed to start server: " + error);
        process.exit(1);
    }
}

startServer();