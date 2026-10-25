import express from 'express'
import { createEnrollment, getAllEnrollments, getEnrollment, updateAllDetailsOfEnrollment, updateCertificateGenerationOfEnrollment, updateEnrollmentStatus, updateProgramProgressOfEnrollment } from './enrollment.controller.js';
import { validateMiddleware } from '../../middlewares/validate.middleware.js';
import { CreateEnrollmentRequestSchema, UpdateCertificateGenerationOfEnrollmentRequestSchema, UpdateEnrollmentRequestSchema, UpdateEnrollmentStatusRequestSchema, UpdateProgramProgressOfEnrollmentRequestSchema } from './enrollment.validation.js';
import { authorizeMiddleware } from '../../middlewares/authorize.middleware.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';



const enrollmentRouter = express.Router();


enrollmentRouter.get('/', authMiddleware, authorizeMiddleware('ADMIN'), getAllEnrollments);
enrollmentRouter.get('/:enrollmentId', authMiddleware, getEnrollment); // need to check the ownership

enrollmentRouter.post('/',validateMiddleware(CreateEnrollmentRequestSchema), authMiddleware,  createEnrollment);

enrollmentRouter.patch('/:enrollmentId', validateMiddleware(UpdateEnrollmentRequestSchema), authMiddleware,  updateAllDetailsOfEnrollment);

enrollmentRouter.patch('/:enrollmentId/certificate', validateMiddleware(UpdateCertificateGenerationOfEnrollmentRequestSchema), authMiddleware, updateCertificateGenerationOfEnrollment);

enrollmentRouter.patch('/:enrollmentId/progress', validateMiddleware(UpdateProgramProgressOfEnrollmentRequestSchema), authMiddleware,  updateProgramProgressOfEnrollment);

enrollmentRouter.patch('/:enrollmentId/status', validateMiddleware(UpdateEnrollmentStatusRequestSchema), authMiddleware, updateEnrollmentStatus);


export default enrollmentRouter;


/* 
    /api/v1/students/:studentId/enrolls :- get all enrollments done by a student
*/