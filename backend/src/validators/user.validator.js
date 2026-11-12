import Joi from 'joi';

export const listUsersQuerySchema = Joi.object({
  search: Joi.string().trim().allow('').max(50).default(''),
});