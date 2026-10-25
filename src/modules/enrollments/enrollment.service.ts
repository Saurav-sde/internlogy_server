import prisma from "../../config/prisma.js"
import { EnrollmentStatus } from "../../generated/prisma/enums.js";
import { ApiError } from "../../utils/ApiError.js";
import { getProgram } from "../programs/program.service.js";
import { getUser } from "../users/user.service.js";
import type { CreateEnrollmentInput, UpdateEnrollmentInput, UpdateEnrollmentStatusInput } from "./enrollment.validation.js";

// TESTED: working as expected
export const getAllEnrollments = async() => {
    const enrollments = await prisma.enrollment.findMany({});
    return enrollments;
}

// TESTED: working as expected
export const createEnrollment = async(input: CreateEnrollmentInput) => {
    const {programId, userId} = input;

    // check whether program and user exists 
    const [program, student] = await Promise.all([getProgram(programId), getUser(userId)]);

    // check whether the user is already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
            userId_programId: {
                userId,
                programId
            }
        }
    });

    if(existingEnrollment)
        throw new ApiError(409, 'user is already enrolled in this program');

    // create a new enrollment
    const enrollment = await prisma.enrollment.create({
        data: {
            programId,
            userId
        }
    });

    return enrollment;
}

// TESTED: working as expected
export const getEnrollment = async(input: {enrollmentId: number, userId: number}) => {
    const enrollment = await prisma.enrollment.findFirst({
        where: {
            id: input.enrollmentId,
            userId: input.userId
        }
    });

    if(!enrollment)
        throw new ApiError(404, 'enrollment not found');

    return enrollment;
}


export const isEnrollmentExists = async(enrollmentId: number) => {
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            id: enrollmentId
        }
    });

    if(!enrollment)
        throw new ApiError(404, 'enrollment not found');
}

// TESTED: working as expected
export const updateEnrollmentStatus = async(input:UpdateEnrollmentStatusInput, enrollmentId: number) => {
    const enrollment = await isEnrollmentExists(enrollmentId);

    const result = await prisma.enrollment.update({
        where: {
            id: enrollmentId
        },
        data: {
            enrollmentStatus: input.enrollmentStatus
        },
        select: {
            id: true,
            programId: true,
            userId: true,
            enrollmentStatus: true,
            updatedAt: true
        }
    });

    return result;
}

// TESTED: working as expected
export const updateProgramProgressOfEnrollment = async(input: number, enrollmentId: number) => {
    const enrollment = await isEnrollmentExists(enrollmentId);

    const result = await prisma.enrollment.update({
        where: {
            id: enrollmentId
        },
        data: {
            programProgress: input
        },
        select: {
            id: true,
            programId: true,
            userId: true,
            programProgress: true,
            updatedAt: true
        }
    });

    return result;
}


// TESTED: working as expected
export const updateCertificateGenerationOfEnrollment = async(input: boolean, enrollmentId: number) => {
    const enrollment = await isEnrollmentExists(enrollmentId);

    const result  = await prisma.enrollment.update({
        where: {
            id:enrollmentId
        },
        data: {
            certificateGenerated: input
        },
        select: {
            id: true,
            programId: true,
            userId: true,
            certificateGenerated: true,
            updatedAt: true
        }
    });

    return result;
}


// TESTED: working as expected
export const updateAllDetailsOfEnrollment = async(input: UpdateEnrollmentInput, enrollmentId: number) => {
    const enrollment = await isEnrollmentExists(enrollmentId);

    const result = await Promise.all([
        updateCertificateGenerationOfEnrollment(input.certificateGenerated, enrollmentId), 
        updateEnrollmentStatus({enrollmentStatus: input.enrollmentStatus}, enrollmentId),
        updateProgramProgressOfEnrollment(input.programProgress, enrollmentId)
    ]);

    const finalRes: {
        id: number,
        programId: number,
        userId: number,
        enrollmentStatus: EnrollmentStatus,
        certificateGenerated: boolean,
        programProgress: number,
        updatedAt: Date; 
    } = {
        id: result[0].id,
        programId: result[0].programId,
        userId: result[0].userId,
        certificateGenerated: result[0].certificateGenerated,
        enrollmentStatus: result[1].enrollmentStatus,
        programProgress: result[2].programProgress,
        updatedAt: result[0].updatedAt
    };

    return finalRes;
}