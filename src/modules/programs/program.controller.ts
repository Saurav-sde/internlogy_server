import type { Request, Response } from "express";
import * as programService from "./program.service.js";

import type {CreateProgramInput, UpdateProgramInput} from "./program.validation.js";
import type { CreateProgramResponse, UpdateProgramResponse } from "./program.response.js";
import { sendResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";


export const createProgram =  async(req: Request, res: Response) => {
    const body = req.body as CreateProgramInput;
    const result: CreateProgramResponse = await programService.createProgram(body);

    return sendResponse(
        res, 
        201,
        result,
        'program created successfully'
    );
}


export const updateProgram = async(req: Request, res: Response) => {
    const programId = Number(req.params.programId);
    if(!programId || !Number.isInteger(programId) || programId <= 0) 
        throw new ApiError(400, 'invalid or missing program id');

    const body = req.body as UpdateProgramInput;
    const result: UpdateProgramResponse = await programService.updateProgram(body, Number(req.params.programId));

    return sendResponse(
        res,
        201, 
        result,
        'program updated successfully'
    );
}


export const getAllPrograms = async(req: Request, res: Response) => {
    const result = await programService.getAllPrograms();
    return sendResponse(
        res,
        200,
        result,
        'programs fetched successfully'
    )
}


export const getProgram = async(req: Request, res: Response) => {
    const programId = Number(req.params.programId);
    if(!programId || !Number.isInteger(programId) || programId <= 0) 
        throw new ApiError(400, 'invalid or missing program id');
    
    const result = await programService.getProgram(Number(req.params.programId));
    return sendResponse(
        res,
        200,
        result,
        'program fetched successfully'
    )
}


export const getAllModulesOfProgram = async(req: Request, res: Response) => {
    if(!req.params.programId)
        throw new ApiError(404, 'program id is missing');
    const result = await programService.getAllModulesOfProgram(Number(req.params.programId));
    return sendResponse(
        res,
        200,
        result,
        'modules fetched successfully'
    );
}


export const getAllEnrollmentsOfAProgram = async(req: Request, res: Response) => {
    const programId = req.params.programId;
    if(!programId)
        throw new ApiError(404, 'program id is missing');

    const result = await programService.getAllEnrollmentsOfAProgram(Number(programId));
    return sendResponse (
        res,
        200,
        result,
        'enrollments fetched successfully'
    );
}