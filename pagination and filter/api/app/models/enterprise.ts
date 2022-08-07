import { Schema, model } from 'mongoose';

const EnterpriseSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  topics: {
    type: String,
  },
  email: {
    type: String,
  },
  mobileNumber: {
    type: String,
  },
  contactNumber: {
    type: String,
  },
  message: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const EnterpriseModel = model('enterprise', EnterpriseSchema);
