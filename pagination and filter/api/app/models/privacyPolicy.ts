import { Schema, model } from 'mongoose';

const PrivacyPolicySchema: Schema = new Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
});

export const PrivacyPolicyModel = model('privacyPolicy', PrivacyPolicySchema);
