import type { CreateModuleResponse, UpdateModuleResponse } from "./module.response.js";
import type { CreateModuleInput, UpdateModuleInput } from "./module.validation.js";

import prisma from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { getProgram } from "../programs/program.service.js";


// check whether a module exists or not , if exists return details of modules
export const isModuleExists = async(moduleId: number) => {
    const module = await prisma.module.findUnique({
        where:{id: moduleId},
        omit: {
            createdAt: true,
            updatedAt: true,
            isActive: true
        }
    })

    if(!module)
        throw new ApiError(404, 'module not found');

    return module;
}

export const createModule = async(input: CreateModuleInput) => {
    const {
        title,
        programId,
        order
    } = input;

    // check whether program exists or not
    const program = await getProgram(programId);

    const result:CreateModuleResponse = await prisma.module.create({
        data: {
            title: title.trim().toLowerCase(),
            programId: programId,
            order: order
        }
    });

    return result;
}



export const updateModule = async(input: UpdateModuleInput, moduleId: number) => {
    const {
        title,
        programId,
        order
    } = input;

    const [program, module] = await Promise.all(
        [getProgram(programId), isModuleExists(moduleId)]
    );

    const result: UpdateModuleResponse = await prisma.module.update({
        where: {id: moduleId},
        data: {
            title: title.trim().toLowerCase(),
            programId,
            order
        },
        omit: {
            createdAt: true,
            isActive: true
        }
    });

    return result;
}


export const getModule = async(moduleId: number) => {
    const module = await isModuleExists(moduleId);
    const result = await prisma.module.findUnique({
        where: {id: moduleId},
    });

    return result;
}