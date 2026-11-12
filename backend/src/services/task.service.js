import Task from '../models/Task.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import escapeRegex from '../utils/escapeRegex.js';
import { getPagination, buildPaginationMeta, buildSort } from '../utils/queryHelpers.js';

const TASK_POPULATE = [
  { path: 'project', select: 'name status' },
  { path: 'assignedTo', select: 'name email' },
  { path: 'createdBy', select: 'name email' },
];

const assertProjectExists = async (projectId) => {
  if (!(await Project.exists({ _id: projectId }))) {
    throw ApiError.notFound('Project not found');
  }
};

const assertUserExists = async (userId) => {
  if (!(await User.exists({ _id: userId }))) {
    throw ApiError.notFound('Assigned user not found');
  }
};

const findTaskOrFail = async (id) => {
  const task = await Task.findById(id);
  if (!task) {
    throw ApiError.notFound('Task not found');
  }
  return task;
};

export const createTask = async (data, userId) => {
  await assertProjectExists(data.project);

  const assignedTo = data.assignedTo || null;
  if (assignedTo) await assertUserExists(assignedTo);

  const task = await Task.create({ ...data, assignedTo, createdBy: userId });
  return task.populate(TASK_POPULATE);
};

export const getTasks = async (query) => {
  const { search, status, priority, assignedTo, project } = query;

  const filter = {};
  if (search) filter.title = new RegExp(escapeRegex(search), 'i');
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignedTo) filter.assignedTo = assignedTo;
  if (project) filter.project = project;

  const { page, limit, skip } = getPagination(query);

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .sort(buildSort(query))
      .skip(skip)
      .limit(limit)
      .populate(TASK_POPULATE)
      .lean(),
    Task.countDocuments(filter),
  ]);

  return { tasks, pagination: buildPaginationMeta({ total, page, limit }) };
};

export const getTaskById = async (id) => {
  const task = await Task.findById(id).populate(TASK_POPULATE);
  if (!task) {
    throw ApiError.notFound('Task not found');
  }
  return task;
};

export const updateTask = async (id, data) => {
  const task = await findTaskOrFail(id);
  const changes = { ...data };

  if (changes.project) await assertProjectExists(changes.project);

  if ('assignedTo' in changes) {
    changes.assignedTo = changes.assignedTo || null;
    if (changes.assignedTo) await assertUserExists(changes.assignedTo);
  }

  task.set(changes);
  await task.save();

  return task.populate(TASK_POPULATE);
};

export const updateTaskStatus = async (id, status) => {
  const task = await findTaskOrFail(id);

  task.status = status;
  await task.save();

  return task.populate(TASK_POPULATE);
};

export const deleteTask = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  if (!task) {
    throw ApiError.notFound('Task not found');
  }
  return task;
};