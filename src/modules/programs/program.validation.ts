
import {z} from "zod"



export const CreateProgramRequestSchema = z.object({
    title: z.string().min(3),
    fees: z.number(),
    overview: z.string().min(10),
    durationInWeeks: z.number(),
});

export const UpdateProgramRequestSchema = CreateProgramRequestSchema; // client will send all the details



export type CreateProgramInput = z.infer<typeof CreateProgramRequestSchema>;
export type UpdateProgramInput = z.infer<typeof UpdateProgramRequestSchema>;