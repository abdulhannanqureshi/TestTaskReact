import { Schema, model } from 'mongoose';

const TransactionSchema: Schema = new Schema({
  moduleId: [
    {
      type: Schema.Types.ObjectId,
      ref: 'module',
    },
  ],
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  labId: {
    type: Schema.Types.ObjectId,
    ref: 'labs',
  },
  promoId: {
    type: Schema.Types.ObjectId,
    ref: 'promo',
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'course',
  },
  promoDetail: {
    type: String,
  },
  promoCode: {
    type: String,
  },
  transactionId: {
    type: String,
  },
  chargeId: {
    type: String,
  },
  subTotal: {
    type: String,
  },
  grandTotal: {
    type: String,
  },
  siteDiscount: {
    type: String,
  },
  discountedAmount: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  expireDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const TransactionModel = model('transaction', TransactionSchema);
