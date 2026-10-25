import { z} from "zod";

export const CreateUserResponseSchema = z.object({
    id: z.number(),
    name: z.string().nullable(),
    email: z.string(),
    phoneNo: z.string().nullable(),
    dob: z.coerce.date().nullable(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHERS', 'PREFER_NOT_TO_SAY']).nullable(),
    university: z.string().nullable(),
    college: z.string().nullable(),
    graduationYear: z.number().nullable(),
    course: z.string().nullable(),
    currentYear: z.number().nullable(),
    registrationId: z.string().nullable()
});


export const UpdateUserResponseSchema = CreateUserResponseSchema;

export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;
export type UpdateUserResponse = z.infer<typeof UpdateUserResponseSchema>;