import mongoose from 'mongoose';
import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';

const normaliseError = (err) => {
  if (err instanceof ApiError) return err;

  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    return new ApiError(400, 'Validation failed', errors);
  }
  if (err instanceof mongoose.Error.CastError) {
    return new ApiError(400, `Invalid ${err.path}: ${err.value}`);
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return new ApiError(409, `${field} already exists`);
  }
  if (err.name === 'JsonWebTokenError') return new ApiError(401, 'Invalid token');
  if (err.name === 'TokenExpiredError') return new ApiError(401, 'Token expired, please login again');
  if (err.type === 'entity.parse.failed') return new ApiError(400, 'Invalid JSON payload');

  return err;
};

const errorHandler = (err, req, res, next) => {
  const error = normaliseError(err);
  const statusCode = error.statusCode || 500;
  const isServerError = statusCode >= 500;

  if (isServerError) console.error(err);

  const body = {
    success: false,
    message: isServerError && env.isProduction ? 'Internal server error' : error.message,
  };
  if (error.errors) body.errors = error.errors;
  if (!env.isProduction && isServerError) body.stack = err.stack;

  res.status(statusCode).json(body);
};

export default errorHandler;