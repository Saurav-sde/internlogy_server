import {z} from "zod";


export const CreateModuleResponseSchema = z.object({
    id: z.number(),
    programId: z.number(),
    title: z.string(),
    order: z.number()
});

export const UpdateModuleResponseSchema = CreateModuleResponseSchema;

export type CreateModuleResponse = z.infer<typeof CreateModuleResponseSchema>;
export type UpdateModuleResponse = z.infer<typeof UpdateModuleResponseSchema>;