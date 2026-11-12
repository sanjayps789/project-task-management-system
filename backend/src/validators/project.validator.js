import Joi from 'joi';
import { PRIORITIES, PROJECT_STATUSES } from '../utils/constants.js';

export const createProjectSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().allow('').max(1000).default(''),
  startDate: Joi.date().iso().required(),
  dueDate: Joi.date()
    .iso()
    .min(Joi.ref('startDate'))
    .required()
    .messages({
      'date.min': 'Due date must be on or after start date',
      'any.ref': 'Due date cannot be checked until start date is a valid date',
    }),
  priority: Joi.string().valid(...PRIORITIES).default('Medium'),
  status: Joi.string().valid(...PROJECT_STATUSES).default('Planning'),
});


export const updateProjectSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  description: Joi.string().trim().allow('').max(1000),
  startDate: Joi.date().iso(),
  dueDate: Joi.date().iso(),
  priority: Joi.string().valid(...PRIORITIES),
  status: Joi.string().valid(...PROJECT_STATUSES),
})
  .min(1)
  .messages({ 'object.min': 'At least one field is required to update the project' });

export const listProjectsQuerySchema = Joi.object({
  search: Joi.string().trim().allow('').max(100).default(''),
  status: Joi.string().valid(...PROJECT_STATUSES),
  priority: Joi.string().valid(...PRIORITIES),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('createdAt', 'dueDate').default('createdAt'),
  order: Joi.string().valid('asc', 'desc').default('desc'),
});