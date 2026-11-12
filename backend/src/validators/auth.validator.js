import Joi from 'joi';

const passwordRule = Joi.string()
  .min(8)
  .max(64)
  .pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
  .messages({
    'string.pattern.base': 'Password must contain at least one letter and one number',
  });

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: passwordRule.required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().required(),
});