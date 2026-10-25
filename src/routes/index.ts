import express from 'express';

import userRouter from '../modules/users/user.routes.js';
import programRouter from '../modules/programs/program.routes.js';
import moduleRouter from '../modules/modules/module.routes.js';
import enrollmentRouter from '../modules/enrollments/enrollment.routes.js';
import authRouter from '../modules/auth/auth.routes.js';

const router = express.Router();

router.use("/v1/users", userRouter);
router.use('/v1/programs', programRouter);
router.use('/v1/modules', moduleRouter);
router.use('/v1/enrolls', enrollmentRouter);
router.use('/v1/auths', authRouter);

export default router;




