

import {z} from "zod";

export const CreateModuleRequestSchema = z.object({
    programId: z.number(),
    title: z.string(),
    order: z.number()
});

export const UpdateModuleRequestSchema = CreateModuleRequestSchema;

export type CreateModuleInput = z.infer<typeof CreateModuleRequestSchema>;

export type UpdateModuleInput = z.infer<typeof UpdateModuleRequestSchema>;