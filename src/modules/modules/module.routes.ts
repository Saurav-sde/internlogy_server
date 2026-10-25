import express from 'express';
import { createModule, getModule } from './module.controller.js';
import { validateMiddleware } from '../../middlewares/validate.middleware.js';

import { UpdateModuleRequestSchema, CreateModuleRequestSchema } from './module.validation.js';
import { updateModule } from './module.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { authorizeMiddleware } from '../../middlewares/authorize.middleware.js';


const moduleRouter = express.Router();


moduleRouter.get('/:moduleId', authMiddleware, getModule);
moduleRouter.post('/', validateMiddleware(CreateModuleRequestSchema), authMiddleware, authorizeMiddleware('ADMIN'), createModule);
moduleRouter.patch('/:moduleId', validateMiddleware(UpdateModuleRequestSchema), authMiddleware, authorizeMiddleware('ADMIN'), updateModule);


export default moduleRouter;