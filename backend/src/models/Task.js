import mongoose from 'mongoose';
import { PRIORITIES, TASK_STATUSES } from '../utils/constants.js';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [2, 'Task title must be at least 2 characters'],
      maxlength: [150, 'Task title must not exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description must not exceed 2000 characters'],
      default: '',
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project is required'],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null = unassigned
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    priority: {
      type: String,
      enum: { values: PRIORITIES, message: '{VALUE} is not a valid priority' },
      default: 'Medium',
    },
    status: {
      type: String,
      enum: { values: TASK_STATUSES, message: '{VALUE} is not a valid task status' },
      default: 'Todo',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ title: 1 });
taskSchema.index({ createdAt: -1 });
taskSchema.index({ dueDate: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;