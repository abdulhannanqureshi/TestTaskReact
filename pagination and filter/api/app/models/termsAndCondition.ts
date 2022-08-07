import { Schema, model } from 'mongoose';

const TermsAndConditionSchema: Schema = new Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
});

export const TermsAndConditionModel = model(
  'termsAndCondition',
  TermsAndConditionSchema
);
