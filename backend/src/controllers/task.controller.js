import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import * as taskService from '../services/task.service.js';

export const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.body, req.user._id);

  sendSuccess(res, {
    statusCode: 201,
    message: 'Task created successfully',
    data: task,
  });
});

export const getTasks = asyncHandler(async (req, res) => {
  const { tasks, pagination } = await taskService.getTasks(req.validated.query);

  sendSuccess(res, {
    message: 'Tasks fetched successfully',
    data: tasks,
    pagination,
  });
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id);

  sendSuccess(res, { message: 'Task fetched successfully', data: task });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.body);

  sendSuccess(res, { message: 'Task updated successfully', data: task });
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await taskService.updateTaskStatus(req.params.id, req.body.status);

  sendSuccess(res, { message: 'Task status updated successfully', data: task });
});

export const deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.params.id);

  sendSuccess(res, { message: 'Task deleted successfully' });
});