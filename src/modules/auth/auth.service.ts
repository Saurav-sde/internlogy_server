import prisma from "../../config/prisma.js";
import jwt from 'jsonwebtoken';
import { ApiError } from "../../utils/ApiError.js";
import type { RegisterAdminInput } from "./auth.validation.js";
import { env } from "../../config/env.js";


export const authenticateUser = async(input: {
        id: number,
        email: string,
        role: string
    }
) => {    
    
    const payload = {
        email: input.email,
        id: input.id,
        role: input.role
    };

    const accessToken = jwt.sign(
        payload,
        env.JWT_SECRET,
        {
            expiresIn: "10m"
        }
    );
    
    if(!accessToken)
        throw new ApiError(401, 'something went wrong');

    return {payload, accessToken};
}



export const getUserByGoogleId = async (googleId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            googleId
        }
    });

    return user;
}


export const getUserByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    return user;
}



export const getUserWithOauthId = async (input: {email: string}) => {
    const user = await prisma.user.findUnique({
        where: {
            email: input.email
        }
    });

    return user;
}

export const linkUserWithOauth = async(input: {userId: number, googleId: string}) => {
    await prisma.user.update({
        where: {
            id: input.userId
        },
        data: {
            googleId: input.googleId
        }
    });
}


export const createUserWithOauth = async(input: {email: string, googleId: string}) => {
    const user = await prisma.user.create({
        data: {
            email: input.email,
            googleId: input.googleId
        }
    });

    return user;
}


export const checkMe = async(user: any) => {
    if(!user)
        throw new ApiError(401, 'unauthorized');

    const {id, role, email} = user;

    const profile = await prisma.user.findUnique({
        where: {
            id,
            email
        }
    });

    return profile;

}


export const registerAdmin = async(input: RegisterAdminInput) => {
    let {email, name, phoneNo, whatsAppNo} = input;
    
    email = email.trim().toLowerCase();
    name = name.trim();
    phoneNo = phoneNo.trim();
    whatsAppNo = whatsAppNo.trim();

    const emailExist = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if(emailExist)
        throw new ApiError(409, 'email already exists');

    const admin = await prisma.user.create({
        data: {
            email,
            name,
            phoneNo,
            whatsAppNo,
            role: 'ADMIN'
        }
    });

    if(!admin)
        throw new ApiError(500, 'internal server error');

    return admin;
}