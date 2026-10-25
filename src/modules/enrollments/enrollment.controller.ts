import type { Request, Response } from "express";
import type { CreateEnrollmentInput, UpdateCertificateGenerationOfEnrollmentInput, UpdateEnrollmentInput, UpdateEnrollmentStatusInput, UpdateProgramProgressOfEnrollmentInput } from "./enrollment.validation.js";
import * as enrollmentService from "./enrollment.service.js";
import { sendResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";


export const getAllEnrollments = async(req:Request, res: Response) => {
    const result = await enrollmentService.getAllEnrollments();

    return sendResponse (
        res,
        200,
        result,
        'enrollments fetched successfully'
    );
}



export const getEnrollment = async(req: Request, res: Response) => {
    const enrollmentId = Number(req.params.enrollmentId);

    if(!enrollmentId || !Number.isInteger(enrollmentId) || enrollmentId <= 0)
        throw new ApiError(400, 'invalid or missing enrollment id');

    const result = await enrollmentService.getEnrollment({enrollmentId, userId: Number(req.user?.id)});
    return sendResponse (
        res,
        200,
        result,
        'enrollment fetched successfully'
    );
}


export const createEnrollment = async(req: Request, res: Response) => {
    const body = req.body as CreateEnrollmentInput;
    const result = await enrollmentService.createEnrollment(body);

    return sendResponse(
        res, 
        201,
        result,
        'user enrolled successfully in this program'
    );
}



export const updateEnrollmentStatus = async(req: Request, res: Response) => {
    const body = req.body as UpdateEnrollmentStatusInput;
     const enrollmentId = Number(req.params.enrollmentId);

    if(!enrollmentId || !Number.isInteger(enrollmentId) || enrollmentId <= 0)
        throw new ApiError(400, 'invalid or missing enrollment id');

    const result = await enrollmentService.updateEnrollmentStatus(body, Number(enrollmentId));

    return sendResponse (
        res, 
        201,
        result,
        'enrollment status updated successfully'
    );
}

export const updateProgramProgressOfEnrollment = async(req: Request, res: Response) => {
    const body = req.body as UpdateProgramProgressOfEnrollmentInput;
    
    const enrollmentId = Number(req.params.enrollmentId);
    if(!enrollmentId || !Number.isInteger(enrollmentId) || enrollmentId <= 0)
        throw new ApiError(400, 'invalid or missing enrollment id');

    const result = await enrollmentService.updateProgramProgressOfEnrollment(body.programProgress, Number(enrollmentId));
    return sendResponse(
        res,
        201,
        result,
        'progress is updated successfully'
    );
}

export const updateCertificateGenerationOfEnrollment = async(req: Request, res: Response) => {
    const body = req.body as UpdateCertificateGenerationOfEnrollmentInput;
    
    const enrollmentId = Number(req.params.enrollmentId);
    if(!enrollmentId || !Number.isInteger(enrollmentId) || enrollmentId <= 0)
        throw new ApiError(400, 'invalid or missing enrollment id');

    const result = await enrollmentService.updateCertificateGenerationOfEnrollment(body.certificateGenerated, Number(enrollmentId));
    return sendResponse(
        res,
        201,
        result,
        'certificate is updated successfully'
    );
}

export const updateAllDetailsOfEnrollment = async(req:Request, res: Response) => {
    const body = req.body as UpdateEnrollmentInput;
    
    const enrollmentId = Number(req.params.enrollmentId);
    if(!enrollmentId || !Number.isInteger(enrollmentId) || enrollmentId <= 0)
        throw new ApiError(400, 'invalid or missing enrollment id');

    const result = await enrollmentService.updateAllDetailsOfEnrollment(body, Number(enrollmentId));
    return sendResponse(
        res,
        201,
        result,
        'enrollment details is updated successfully'
    );
}