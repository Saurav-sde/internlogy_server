import type { Request, Response } from "express";
import type { CreateUserInput, UpdateUserInput } from "./user.validation.js";
import * as userService from "./user.service.js";
import type { CreateUserResponse, UpdateUserResponse } from "./user.response.js";
import { sendResponse } from "../../utils/ApiResponse.js";

import { ApiError } from "../../utils/ApiError.js";


export const createUser = async(req: Request, res:Response) => {
    const body = req.body as CreateUserInput;
    const result:CreateUserResponse = await userService.createUser(body);

    return sendResponse(
        res,
        201,
        result,
        "user created successfully"
    );
}


export const updateUser = async(req: Request, res:Response) => {
    const userId = Number(req.params.userId);
    if(!userId || !Number.isInteger(userId) || userId <= 0)
        throw new ApiError(400, 'invalid or missing user id');

    if(req.user?.id !== userId)
        throw new ApiError(403, 'You cannot access this profile');
    
    const body = req.body as UpdateUserInput;
    const result: UpdateUserResponse = await userService.updateUser(body, Number(req.params.userId));

    return sendResponse(
        res, 
        201,
        result,
        "user updated successfully"
    );
}


export const getUser = async(req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    if(!userId || !Number.isInteger(userId) || userId <= 0)
        throw new ApiError(400, 'invalid or missing user id');

    if(req.user?.id !== userId)
        throw new ApiError(403, 'You cannot access this profile');

    const result = await userService.getUser(userId);
    return sendResponse(
        res, 
        200,
        result,
        "user fetched successfully"
    )
}

export const getAllUsers = async(req: Request, res: Response) => {
    const result = await userService.getAllUsers();
    return sendResponse(
        res,
        200,
        result,
        'users fetched successfully'
    )
}



export const getAllEnrollmentsOfAUser = async(req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    if(!userId)
        throw new ApiError(404, 'user id is missing');

    if(userId !== req.user?.id)
        throw new ApiError(403, 'you cannot access this profile');

    const result = await userService.getAllEnrollmentsOfAUser(Number(userId));
    return sendResponse(
        res, 
        200, 
        result,
        'enrollments fetched successfully'
    );
}