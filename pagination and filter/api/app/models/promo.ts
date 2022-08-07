import { Schema, model } from 'mongoose';

const PromoSchema: Schema = new Schema({
  promoTitle: {
    type: String,
  },
  promoCode: {
    type: String,
  },
  percentOff: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'course',
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
  endDate: {
    type: Date,
  },
  startDate: {
    type: Date,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const PromoModel = model('promo', PromoSchema);
