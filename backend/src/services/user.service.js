import User from '../models/User.js';
import escapeRegex from '../utils/escapeRegex.js';

export const listUsers = async ({ search = '' } = {}) => {
  const filter = {};

  if (search) {
    const pattern = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ name: pattern }, { email: pattern }];
  }

  return User.find(filter).select('name email').sort({ name: 1 }).lean();
};