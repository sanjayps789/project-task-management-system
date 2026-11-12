import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import * as projectService from '../services/project.service.js';

export const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createProject(req.body, req.user._id);

  sendSuccess(res, {
    statusCode: 201,
    message: 'Project created successfully',
    data: project,
  });
});

export const getProjects = asyncHandler(async (req, res) => {
  const { projects, pagination } = await projectService.getProjects(req.validated.query, req.user._id);

  sendSuccess(res, {
    message: 'Projects fetched successfully',
    data: projects,
    pagination,
  });
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await projectService.getProjectById(req.params.id, req.user._id);

  sendSuccess(res, {
    message: 'Project fetched successfully',
    data: project,
  });
});

export const updateProject = asyncHandler(async (req, res) => {

  const project = await projectService.updateProject(req.params.id, req.body, req.user._id);

  sendSuccess(res, {
    message: 'Project updated successfully',
    data: project,
  });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const { deletedTasks } = await projectService.deleteProject(req.params.id, req.user._id);

  sendSuccess(res, {
    message: 'Project and its tasks deleted successfully',
    data: { deletedTasks },
  });
});