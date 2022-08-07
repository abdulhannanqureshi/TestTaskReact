import { Schema, model } from 'mongoose';

const CertificateRequestSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'course',
  },
  status: {
    type: String,
    enum: ['Pending', 'Approve', 'Awaiting Payment', 'Deny', 'Expired'],
    default: 'Pending',
  },
  certificate: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  validTo: {
    type: Date,
    default: null,
  },
  linkExpireDate: {
    type: Date,
    default: null,
  },
  validFrom: {
    type: Date,
    default: null,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const CertificateRequestModel = model(
  'certificateRequest',
  CertificateRequestSchema
);
