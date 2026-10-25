import { Role } from "../generated/prisma/enums.ts";


declare global {
    namespace Express {
        interface Request {
            user? : {
                id: number,
                role: Role,
                email: string
            }
        }
    }
}

export {};