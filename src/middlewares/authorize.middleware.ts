import type { Request, Response, NextFunction, RequestHandler } from "express";
import { ApiError } from "../utils/ApiError.js";
import { Role } from "../generated/prisma/enums.js";


export const authorizeMiddleware = (
    ...allowedRoles: Role[]
): RequestHandler => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ApiError(401, "Authentication required"));
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(new ApiError(403, "Access denied"));
        }

        next();
    };
};
