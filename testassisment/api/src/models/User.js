/** @format */

import { Schema, model } from 'mongoose';

const schema = new Schema({
  name: { type: String, default: '' },
  email: { type: String, default: null },
  lastLoginAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = model('users', schema);
