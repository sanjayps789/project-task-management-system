import ApiError from '../utils/ApiError.js';

const validate = (schema, property = 'body') => (req, res, next) => {
  const { value, error } = schema.validate(req[property], {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.') || property,
      message: detail.message.replace(/"/g, ''),
    }));
    return next(ApiError.badRequest('Validation failed', errors));
  }

  if (property === 'body') {
    req.body = value;
  } else {
    req.validated = { ...(req.validated || {}), [property]: value };
  }
  return next();
};

export default validate;