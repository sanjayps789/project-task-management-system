import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import * as userService from '../services/user.service.js';

export const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.listUsers(req.validated.query);

  sendSuccess(res, {
    message: 'Users fetched successfully',
    data: users,
  });
}); 