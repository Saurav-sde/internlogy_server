import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { ZodObject } from "zod";
import { ApiError } from "../utils/ApiError.js";


export const validateMiddleware = (schema: ZodObject):RequestHandler => (req: Request, res: Response, next:NextFunction) => {
    console.log("reached in validation middleware");
    const result = schema.safeParse(req.body);
    if(!result.success) {
        return next(new ApiError(400, 'validation failed', result.error.issues))
    }

    req.body = result.data;
    next();
}