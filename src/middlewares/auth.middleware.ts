import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { redis } from "../config/redis.js";
import jwt from 'jsonwebtoken'
import prisma from "../config/prisma.js";
import { env } from "../config/env.js";


interface JwtPayload {
    id: number,
    role: "USER" | "ADMIN"
    email: string
}


export const authMiddleware = async(req: Request, res: Response, next: NextFunction) => {

    // extract token
    const accessToken = req.cookies?.accessToken;
    if(!accessToken)
        throw new ApiError(401, 'invalid token');

    // check whether the token is blacklisted
    const isBlacklisted = await redis.get(`blacklisted:token:${accessToken}`);
    if(isBlacklisted)
        throw new ApiError(401, 'invalid token');

    // verify the token
    const payload = jwt.verify(accessToken, env.JWT_SECRET) as JwtPayload;
    if(!payload)
        throw new ApiError(401, 'invalid token');

    const {id, email, role} = payload;
    if(!id || !email || !role)
        throw new ApiError(401, 'invalid token');

    // get the user from the db
    const user = await prisma.user.findUnique({
        where: {
            id,
            email
        }
    });

    if(!user)
        throw new ApiError(404, 'user not found');

    req.user = {
        email: user.email,
        role: user.role,
        id: user.id
    }

    next();
}