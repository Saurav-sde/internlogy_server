import prisma from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import type { CreateUserResponse, UpdateUserResponse } from "./user.response.js";
import type { CreateUserInput, UpdateUserInput } from "./user.validation.js";



export const createUser = async (input: CreateUserInput) => {

    /*
        TESTED: working as per expected
        TO DO:
            - hash the password, 
            - But first checks the requirements , as we are doing google oauth and i think it doesn't need password to authenticate as google will do this on behalf of me
            - if no need then remove password field from schema and change according to that in the code
    */

  const {
    name,
    email,
    phoneNo,
    whatsAppNo,
    dob,
    gender,
    university,
    college,
    course,
    graduationYear,
    currentYear,
    registrationId,
  } = input;

  // check whether email already exists
  const emailExist = await prisma.user.findUnique({
    where: {
        email: email
    }
  });

  if(emailExist)
    throw new ApiError(409, 'email already exists');


  const result: CreateUserResponse = await prisma.user.create({
    data: {
      name: name?.trim().toLowerCase() ?? null,
      email: email.trim().toLowerCase(),
      phoneNo: phoneNo?.trim() || null,
      whatsAppNo: whatsAppNo?.trim() || null,
      dob: dob ?? null,
      gender: gender ?? null,
      university: university?.trim() || null,
      college: college?.trim() || null,
      course: course?.trim().toLowerCase() || null,
      graduationYear: graduationYear ?? null,
      currentYear: currentYear ?? null,
      registrationId: registrationId?.trim() || null,
      role: 'USER'
    }
  });

  return result;
};



// not tested
export const updateUser = async(input: UpdateUserInput, id:number) => {
    const {name, phoneNo, dob, gender, university, college, course, graduationYear, currentYear, registrationId} = input;

    // check whether id exists or not
    const userFound = await prisma.user.findUnique({
        where: {id},
        select: {
            id: true,
            email: true,
            password: true
        }
    });
    
    if(!userFound)
        throw new ApiError(404, 'user not found');

    const result:UpdateUserResponse = await prisma.user.update({
        where: {id},
        data: {
            email: userFound.email,
            id: userFound.id,
            name,
            phoneNo,
            dob,
            gender,
            university,
            college,
            graduationYear,
            course,
            currentYear,
            registrationId
        }
    });

    return result;
}


// tested and working as expected
export const getUser = async(id:number) => {
    const user = await prisma.user.findUnique({
        where: {id}
    });

    if(!user) {
        throw new ApiError(404, 'user not found');
    }

    return user;
}


export const getAllUsers = async() => {
    const users = await prisma.user.findMany({});
    return users;
}


export const getAllEnrollmentsOfAUser = async(userId: number) => {
    const user = await getUser(userId);
    const result = await prisma.enrollment.findMany({
        where: {userId}
    });

    return result;
}