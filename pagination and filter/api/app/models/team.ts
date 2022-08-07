import { Schema, model } from 'mongoose';

const TeamSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  designation: {
    type: String,
  },
  aboutUs: {
    type: String,
  },
  teamMemberImage: {
    type: String,
  },
  order: {
    type: Number,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  isDeleted: {
    type: Boolean,
    default: false,
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

export const TeamModel = model('team', TeamSchema);
