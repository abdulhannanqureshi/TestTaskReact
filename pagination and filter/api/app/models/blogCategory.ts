import { Schema, model } from 'mongoose';

const BlogCategorySchema: Schema = new Schema({
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

export const BlogCategoryModel = model('blogCategory', BlogCategorySchema);
