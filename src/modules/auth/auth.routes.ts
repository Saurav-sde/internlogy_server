import express from 'express'
import { checkMe, getGoogleLoginCallback, getGoogleLoginPage, logOutUser, registerAdmin } from './auth.controller.js';
import { authorizeMiddleware } from '../../middlewares/authorize.middleware.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateMiddleware } from '../../middlewares/validate.middleware.js';
import { RegisterAdminRequestSchema } from './auth.validation.js';

const authRouter = express.Router();

authRouter.get('/google', getGoogleLoginPage)
authRouter.get('/google/callback', getGoogleLoginCallback)
authRouter.get('/me', authMiddleware, checkMe);


authRouter.post('/logout', authMiddleware, logOutUser);
authRouter.post('/register/admin', validateMiddleware(RegisterAdminRequestSchema),authMiddleware, authorizeMiddleware('ADMIN'), registerAdmin);

export default authRouter;