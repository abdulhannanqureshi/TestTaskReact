import { Schema, model } from 'mongoose';

const labsSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'course',
  },
  link: {
    type: String,
  },
  amount: {
    type: Number,
  },
  labsImage: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
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
});

export const LabsModel = model('labs', labsSchema);
