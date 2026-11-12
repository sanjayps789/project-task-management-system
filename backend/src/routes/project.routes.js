import { Router } from 'express';
import * as projectController from '../controllers/project.controller.js';
import validate from '../middlewares/validate.js';
import { protect } from '../middlewares/auth.middleware.js';
import { idParamSchema } from '../validators/common.validator.js';
import {
  createProjectSchema,
  updateProjectSchema,
  listProjectsQuerySchema,
} from '../validators/project.validator.js';

const router = Router();

router.use(protect);

router
  .route('/')
  .get(validate(listProjectsQuerySchema, 'query'), projectController.getProjects)
  .post(validate(createProjectSchema), projectController.createProject);

router
  .route('/:id')
  .get(validate(idParamSchema, 'params'), projectController.getProject)
  .put(validate(idParamSchema, 'params'), validate(updateProjectSchema), projectController.updateProject)
  .delete(validate(idParamSchema, 'params'), projectController.deleteProject);

export default router;