import Joi from 'joi';

const OBJECT_ID_MESSAGES = {
  'string.length': '{{#label}} must be a valid 24 character id',
  'string.hex': '{{#label}} must be a valid 24 character id',
};

export const objectIdSchema = Joi.string().hex().length(24).messages(OBJECT_ID_MESSAGES);

export const idParamSchema = Joi.object({
  id: objectIdSchema.required(),
});