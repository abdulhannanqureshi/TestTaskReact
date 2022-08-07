import { Schema, model } from 'mongoose';

const PressReleaseCategorySchema: Schema = new Schema({
  categoryName: {
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
createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'user'
},
updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'user'
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

export const PressReleaseCategoryModel = model('pressReleaseCategory', PressReleaseCategorySchema);
