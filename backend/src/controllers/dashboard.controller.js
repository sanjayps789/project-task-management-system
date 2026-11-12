import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import * as dashboardService from '../services/dashboard.service.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getDashboardData(req.user._id);

  sendSuccess(res, {
    message: 'Dashboard data fetched successfully',
    data,
  });
});