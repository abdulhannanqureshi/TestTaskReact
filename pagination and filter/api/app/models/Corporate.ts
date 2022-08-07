import { Schema, model } from 'mongoose';

const CorporateSchema: Schema = new Schema({
  name: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export const CorporateModel = model('corporate', CorporateSchema);
