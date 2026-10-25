import type {Request, Response} from 'express';
import type { CreateModuleInput, UpdateModuleInput } from './module.validation.js';
import type { CreateModuleResponse } from './module.response.js';

import * as moduleService from "./module.service.js";
import { sendResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';


export const createModule = async(req: Request, res: Response) => {
    const body = req.body as CreateModuleInput;
    const result: CreateModuleResponse = await moduleService.createModule(body);

    return sendResponse(
        res,
        201,
        result,
        'module created successfully'
    );
}



export const getModule = async(req: Request, res: Response) => {
    if(!req.params.moduleId)
        throw new ApiError(404, 'module id is missing');
    const result = await moduleService.getModule(Number(req.params.moduleId));
    return sendResponse(
        res,
        200,
        result,
        'module fetched successfully'
    );
}


export const updateModule = async(req: Request, res: Response) => {
    if(!req.params.moduleId)
        throw new ApiError(404, 'module id is missing');

    const body = req.body as UpdateModuleInput;
    const result = await moduleService.updateModule(body, Number(req.params.moduleId));
    return sendResponse(
        res,
        201,
        result,
        'module updated successfully'
    );
}

