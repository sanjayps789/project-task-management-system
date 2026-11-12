import mongoose from 'mongoose';
import { PRIORITIES, PROJECT_STATUSES } from '../utils/constants.js';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [2, 'Project name must be at least 2 characters'],
      maxlength: [100, 'Project name must not exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description must not exceed 1000 characters'],
      default: '',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
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
      enum: { values: PROJECT_STATUSES, message: '{VALUE} is not a valid project status' },
      default: 'Planning',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

projectSchema.pre('validate', function checkDateOrder() {
  if (this.startDate && this.dueDate && this.dueDate < this.startDate) {
    this.invalidate('dueDate', 'Due date must be on or after start date', this.dueDate);
  }
});

projectSchema.index({ createdAt: -1 });
projectSchema.index({ dueDate: 1 });
projectSchema.index({ name: 1 });

const Project = mongoose.model('Project', projectSchema);

export default Project;