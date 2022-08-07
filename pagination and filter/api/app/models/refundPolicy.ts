import { Schema, model } from 'mongoose';

const RefundPolicySchema: Schema = new Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
});

export const RefundPolicyModel = model('refundPolicy', RefundPolicySchema);
