import prisma from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import type { CreateProgramResponse, UpdateProgramResponse } from "./program.response.js";
import type { CreateProgramInput, UpdateProgramInput } from "./program.validation.js";

/*
    TO DO:
        - create porgram must be done by admin only
*/

// TESTED: working as expected
export const createProgram = async(input: CreateProgramInput) => {
    const {
        title,
        overview,
        fees,
        durationInWeeks
    } = input;

    const result: CreateProgramResponse = await prisma.program.create({
        data: {
            title: title.trim(),
            overview: overview.trim(),
            fees,
            durationInWeeks
        }
    });

    return result;
}

// TESTED: working as expected
export const updateProgram = async(input: UpdateProgramInput, programId: number) => {
    const {
        title, 
        overview,
        fees,
        durationInWeeks
    } = input;

    // check whether program exists or not
    await getProgram(programId);

    const result: UpdateProgramResponse = await prisma.program.update({
        where: {id: programId},
        data: {
            title,
            overview,
            fees,
            durationInWeeks
        },
        omit: {
            createdAt: true,
            isActive: true
        }
    })

    return result;
}

// TESTED: working as expected
export const getAllPrograms = async() => {
    const programs = await prisma.program.findMany({});
    return programs;
}

// TESTED: working as expected
export const getProgram = async(programId: number) => {
    const program = await prisma.program.findUnique({
        where: {id: programId},
        omit: {
            isActive: true,
            createdAt: true,
            updatedAt: true
        }
    });

    if(!program) {
        console.log('inside get program service')
        throw new ApiError(404, 'program not found');
    }

    return program;
}


export const getAllModulesOfProgram = async(programId: number) => {
    // check whether program exists or not
    const program = getProgram(programId);
    const result = await prisma.module.findMany({
        where: {programId}
    });
    return result;
}



export const getAllEnrollmentsOfAProgram = async(programId: number) => {
    const program = await getProgram(programId);
    const result = await prisma.enrollment.findMany({
        where: {
            programId
        }
    });

    return result;
}