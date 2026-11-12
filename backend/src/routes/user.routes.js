import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import validate from '../middlewares/validate.js';
import { protect } from '../middlewares/auth.middleware.js';
import { listUsersQuerySchema } from '../validators/user.validator.js';

const router = Router();

router.use(protect);

router.get('/', validate(listUsersQuerySchema, 'query'), userController.getUsers);

export default router;