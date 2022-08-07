import { Schema, model } from 'mongoose';

const UniversitySchema: Schema = new Schema({
  name: {
    type: String,
  },
  // country: {
  //   type: String,
  // },
  // url: {
  //   type: String,
  // },
  createdAt: {
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
});

export const UniversityModel = model('university', UniversitySchema);
