import { Schema, model } from 'mongoose';

const DoNotSellSchema: Schema = new Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
});

export const DoNotSellModel = model('doNotSell', DoNotSellSchema);
