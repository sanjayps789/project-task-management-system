import { Router } from 'express';
import * as taskController from '../controllers/task.controller.js';
import validate from '../middlewares/validate.js';
import { protect } from '../middlewares/auth.middleware.js';
import { idParamSchema } from '../validators/common.validator.js';
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  listTasksQuerySchema,
} from '../validators/task.validator.js';

const router = Router();

router.use(protect);

router
  .route('/')
  .get(validate(listTasksQuerySchema, 'query'), taskController.getTasks)
  .post(validate(createTaskSchema), taskController.createTask);

router.patch(
  '/:id/status',
  validate(idParamSchema, 'params'),
  validate(updateTaskStatusSchema),
  taskController.updateTaskStatus
);

router
  .route('/:id')
  .get(validate(idParamSchema, 'params'), taskController.getTask)
  .put(validate(idParamSchema, 'params'), validate(updateTaskSchema), taskController.updateTask)
  .delete(validate(idParamSchema, 'params'), taskController.deleteTask);

export default router;