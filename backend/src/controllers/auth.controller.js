import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import * as authService from '../services/auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.registerUser(req.body);

  sendSuccess(res, {
    statusCode: 201,
    message: 'User registered successfully',
    data: { user, token },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.loginUser(req.body);

  sendSuccess(res, {
    message: 'Login successful',
    data: { user, token },
  });
});


export const logout = asyncHandler(async (req, res) => {
  sendSuccess(res, { message: 'Logged out successfully' });
});

export const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, {
    message: 'Current user fetched successfully',
    data: { user: req.user },
  });
});