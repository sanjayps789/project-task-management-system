import Project from '../models/Project.js';
import Task from '../models/Task.js';
import ApiError from '../utils/ApiError.js';
import escapeRegex from '../utils/escapeRegex.js';
import { getPagination, buildPaginationMeta, buildSort } from '../utils/queryHelpers.js';

const CREATOR_FIELDS = 'name email';
const EMPTY_STATS = { total: 0, completed: 0 };

const getTaskStats = async (projectIds) => {
  const rows = await Task.aggregate([
    { $match: { project: { $in: projectIds } } },
    {
      $group: {
        _id: '$project',
        total: { $sum: 1 },
        completed: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
      },
    },
  ]);

  return new Map(rows.map((r) => [String(r._id), { total: r.total, completed: r.completed }]));
};

export const createProject = async (data, userId) => {
  const project = await Project.create({ ...data, createdBy: userId });
  return project.populate('createdBy', CREATOR_FIELDS);
};

export const getProjects = async (query, userId) => {
  const { search, status, priority } = query;

  const filter = { createdBy: userId };
  
  if (search) filter.name = new RegExp(escapeRegex(search), 'i');
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const { page, limit, skip } = getPagination(query);

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .sort(buildSort(query))
      .skip(skip)
      .limit(limit)
      .populate('createdBy', CREATOR_FIELDS)
      .lean(),
    Project.countDocuments(filter),
  ]);

  const statsMap = await getTaskStats(projects.map((p) => p._id));
  const withStats = projects.map((p) => ({
    ...p,
    taskStats: statsMap.get(String(p._id)) || EMPTY_STATS,
  }));

  return { projects: withStats, pagination: buildPaginationMeta({ total, page, limit }) };
};

export const getProjectById = async (id, userId) => {
  // Used findOne to check both project ID and owner
  const project = await Project.findOne({ _id: id, createdBy: userId }).populate('createdBy', CREATOR_FIELDS);
  
  if (!project) {
    throw ApiError.notFound('Project not found or unauthorized access');
  }

  const statsMap = await getTaskStats([project._id]);
  return { ...project.toJSON(), taskStats: statsMap.get(String(project._id)) || EMPTY_STATS };
};

export const updateProject = async (id, data, userId) => {
  // Used findOne to check both project ID and owner
  const project = await Project.findOne({ _id: id, createdBy: userId });
  
  if (!project) {
    throw ApiError.notFound('Project not found or unauthorized access');
  }

  project.set(data);
  await project.save();

  return project.populate('createdBy', CREATOR_FIELDS);
};

export const deleteProject = async (id, userId) => {
  // Used findOne to check both project ID and owner
  const project = await Project.findOne({ _id: id, createdBy: userId });
  
  if (!project) {
    throw ApiError.notFound('Project not found or unauthorized access');
  }

  const { deletedCount } = await Task.deleteMany({ project: project._id });
  await project.deleteOne();

  return { project, deletedTasks: deletedCount };
};