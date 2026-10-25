import {z} from "zod";


export const CreateProgramResponseSchema = z.object({
    id: z.number(),
    title: z.string().min(3),
    overview: z.string().min(10),
    fees: z.number(),
    durationInWeeks: z.number()
});

export const UpdateProgramResponseSchema = CreateProgramResponseSchema;


export type CreateProgramResponse = z.infer<typeof CreateProgramResponseSchema>;
export type UpdateProgramResponse = z.infer<typeof UpdateProgramResponseSchema>;