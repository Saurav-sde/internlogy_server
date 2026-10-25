import express from 'express';
import { createProgram, getAllEnrollmentsOfAProgram, getAllModulesOfProgram, getAllPrograms, getProgram, updateProgram } from './program.controller.js';
import { validateMiddleware } from '../../middlewares/validate.middleware.js';
import { CreateProgramRequestSchema, UpdateProgramRequestSchema } from './program.validation.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { authorizeMiddleware } from '../../middlewares/authorize.middleware.js';



const programRouter = express.Router();

programRouter.get('/:programId/modules', authMiddleware,  getAllModulesOfProgram);
programRouter.get('/:programId/enrolls', authMiddleware, authorizeMiddleware('ADMIN'), getAllEnrollmentsOfAProgram);
programRouter.get('/', authMiddleware,  getAllPrograms);
programRouter.get('/:programId', authMiddleware, getProgram);

programRouter.post('/', validateMiddleware(CreateProgramRequestSchema), authMiddleware, authorizeMiddleware('ADMIN'), createProgram);
programRouter.patch('/:programId', validateMiddleware(UpdateProgramRequestSchema), authMiddleware, authorizeMiddleware('ADMIN'), updateProgram);


export default programRouter;

