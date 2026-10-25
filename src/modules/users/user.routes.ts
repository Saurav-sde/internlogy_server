import express from "express";
import { createUser, getAllEnrollmentsOfAUser, getAllUsers, getUser, updateUser } from "./user.controller.js";
import { validateMiddleware } from "../../middlewares/validate.middleware.js";
import { CreateUserRequestSchema, UpdateUserRequestSchema } from "./user.validation.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { authorizeMiddleware } from "../../middlewares/authorize.middleware.js";


const userRouter = express.Router();

userRouter.get('/', authMiddleware, authorizeMiddleware('ADMIN'), getAllUsers); // verify it
userRouter.get('/:userId', authMiddleware,  getUser);
userRouter.get('/:userId/enrolls', authMiddleware, getAllEnrollmentsOfAUser);

userRouter.post('/',validateMiddleware(CreateUserRequestSchema), authMiddleware, authorizeMiddleware('ADMIN'),  createUser) // verify it
userRouter.patch('/:userId', validateMiddleware(UpdateUserRequestSchema), authMiddleware, updateUser)

export default userRouter;