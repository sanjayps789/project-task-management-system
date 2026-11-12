import Joi from 'joi';
import { PRIORITIES, TASK_STATUSES } from '../utils/constants.js';
import { objectIdSchema } from './common.validator.js';

const title = Joi.string().trim().min(2).max(150);
const description = Joi.string().trim().allow('').max(2000);
const priority = Joi.string().valid(...PRIORITIES);
const status = Joi.string().valid(...TASK_STATUSES);

export const createTaskSchema = Joi.object({
  title: title.required(),
  description: description.default(''),
  project: objectIdSchema.required(),
  assignedTo: objectIdSchema.allow(null, '').default(null),
  dueDate: Joi.date().iso().required(),
  priority: priority.default('Medium'),
  status: status.default('Todo'),
});

export const updateTaskSchema = Joi.object({
  title,
  description,
  project: objectIdSchema,
  assignedTo: objectIdSchema.allow(null, ''),
  dueDate: Joi.date().iso(),
  priority,
  status,
})
  .min(1)
  .messages({ 'object.min': 'At least one field is required to update the task' });

export const updateTaskStatusSchema = Joi.object({
  status: status.required(),
});

export const listTasksQuerySchema = Joi.object({
  search: Joi.string().trim().allow('').max(100).default(''),
  status: status.allow(''),
  priority: priority.allow(''),
  assignedTo: objectIdSchema.allow(''),
  project: objectIdSchema.allow(''),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('createdAt', 'dueDate').default('createdAt'),
  order: Joi.string().valid('asc', 'desc').default('desc'),
});