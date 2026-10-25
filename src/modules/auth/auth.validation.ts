
import {z} from 'zod';
export const RegisterUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});

export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;


export const LoginUserSchema = z.object({
    email:z.string().email(),
    password: z.string().min(8)
});


export const RegisterAdminRequestSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phoneNo: z.string().min(10),
    whatsAppNo: z.string().min(10)
})

export type LoginUserInput = z.infer<typeof LoginUserSchema>;
export type RegisterAdminInput = z.infer<typeof RegisterAdminRequestSchema>;