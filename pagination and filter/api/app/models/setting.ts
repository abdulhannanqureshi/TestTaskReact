import { Schema, model } from 'mongoose';

const SettingSchema: Schema = new Schema({
  courseDuration: {
    type: String,
  },
  moduleDuration: {
    type: String,
  },
  certificateAmount: {
    type: String,
  },
  facebook: {
    type: String,
  },
  twitter: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  pinterest: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  headOfficeAddress: {
    type: String,
  },
});

export const SettingModel = model('setting', SettingSchema);
