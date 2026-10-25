import {z} from "zod";

export const CreateEnrollmentRequestSchema = z.object({
    programId: z.number(),
    userId: z.number()
});

export const UpdateEnrollmentRequestSchema = z.object({
    enrollmentStatus: z.enum(['ACTIVE', 'COMPLETED', 'SUSPENDED', 'DROPPED']),
    certificateGenerated: z.boolean(),
    programProgress: z.number()
});

export const UpdateEnrollmentStatusRequestSchema = z.object({
    enrollmentStatus: z.enum(['ACTIVE', 'COMPLETED', 'SUSPENDED', 'DROPPED'])
});

export const UpdateProgramProgressOfEnrollmentRequestSchema = z.object({
    programProgress: z.number().min(0).max(100)
});

export const UpdateCertificateGenerationOfEnrollmentRequestSchema = z.object({
    certificateGenerated: z.boolean()
})



export type CreateEnrollmentInput = z.infer<typeof CreateEnrollmentRequestSchema>;
export type UpdateEnrollmentInput = z.infer<typeof UpdateEnrollmentRequestSchema>;
export type UpdateEnrollmentStatusInput = z.infer<typeof UpdateEnrollmentStatusRequestSchema>;
export type UpdateProgramProgressOfEnrollmentInput = z.infer<typeof UpdateProgramProgressOfEnrollmentRequestSchema>;
export type UpdateCertificateGenerationOfEnrollmentInput = z.infer<typeof UpdateCertificateGenerationOfEnrollmentRequestSchema>;