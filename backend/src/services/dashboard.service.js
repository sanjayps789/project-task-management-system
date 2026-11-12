import Project from '../models/Project.js';
import Task from '../models/Task.js';
import { PROJECT_STATUSES, TASK_STATUSES } from '../utils/constants.js';

const RECENT_LIMIT = 5;

const toCountMap = (rows, keys) => {
  const map = Object.fromEntries(keys.map((key) => [key, 0]));
  rows.forEach(({ _id, count }) => {
    map[_id] = count;
  });
  return map;
};

const countByStatus = (Model, filter = {}) =>
  Model.aggregate([{ $match: filter }, { $group: { _id: '$status', count: { $sum: 1 } } }]);


const buildTaskFilter = (userId) => ({ $or: [{ assignedTo: userId }, { createdBy: userId }] });

export const getDashboardData = async (userId) => {
  const taskFilter = buildTaskFilter(userId);

  const [taskRows, projectRows, overdueTasks, myOpenTasks, recentProjects, recentTasks] =
    await Promise.all([
      countByStatus(Task, taskFilter),
      countByStatus(Project),
      Task.countDocuments({ ...taskFilter, dueDate: { $lt: new Date() }, status: { $ne: 'Completed' } }),
      Task.countDocuments({ assignedTo: userId, status: { $ne: 'Completed' } }),
      Project.find()
        .sort({ createdAt: -1, _id: -1 })
        .limit(RECENT_LIMIT)
        .populate('createdBy', 'name email')
        .lean(),
      Task.find(taskFilter)
        .sort({ createdAt: -1, _id: -1 })
        .limit(RECENT_LIMIT)
        .populate('project', 'name')
        .populate('assignedTo', 'name email')
        .lean(),
    ]);

  const tasksByStatus = toCountMap(taskRows, TASK_STATUSES);
  const projectsByStatus = toCountMap(projectRows, PROJECT_STATUSES);

  const totalTasks = Object.values(tasksByStatus).reduce((sum, n) => sum + n, 0);
  const totalProjects = Object.values(projectsByStatus).reduce((sum, n) => sum + n, 0);

  return {
    stats: {
      totalProjects,
      totalTasks,
      completedTasks: tasksByStatus.Completed,
      inProgressTasks: tasksByStatus['In Progress'],
      pendingTasks: totalTasks - tasksByStatus.Completed,
      overdueTasks,
      myOpenTasks,
    },
    tasksByStatus,
    projectsByStatus,
    recentProjects,
    recentTasks,
  };
};