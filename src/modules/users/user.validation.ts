import {z} from "zod";

export const CreateUserRequestSchema = z.object({
    name: z.string().min(2),
    email:z.string().email(),
    phoneNo: z.string().min(10),
    whatsAppNo: z.string().min(10),

    dob:z.coerce.date(),
    gender:z.enum(["MALE", "FEMALE", "OTHERS"]),

    university: z.string().min(2),
    college: z.string().min(2),
    course: z.string().min(2),
    graduationYear: z.number(),
    currentYear: z.number(),
    registrationId: z.string()
});


// omit removes those fields 
export const UpdateUserRequestSchema = CreateUserRequestSchema.omit({email: true});



// export const ChangePasswordRequestSchema = z.object({
//     id: z.number(),
//     oldPassword: 
// })

export type CreateUserInput = z.infer<typeof CreateUserRequestSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserRequestSchema>;