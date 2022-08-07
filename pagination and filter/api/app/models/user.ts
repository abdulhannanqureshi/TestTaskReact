import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  firstName: {
    type: String,
  },
  talentLmsUserId: {
    type: String,
    default: '',
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  university: {
    type: String,
    default: '',
  },
  roleName: {
    type: String,
    default: '',
  },
  corporate: {
    type: String,
    default: '',
  },
  password: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  doNotSell: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  verifyToken: {
    type: String,
  },
  rolesPermission: [{ type: String, default: null }],
  role: {
    type: String,
    enum: [
      'Superadmin',
      'Admin',
      'Individual',
      'Student',
      'Corporate Employee',
    ],
    default: 'Individual',
  },
  loggedInIp: {
    type: String,
  },
  loginToken: {
    type: String,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const UserModel = model('user', UserSchema);
