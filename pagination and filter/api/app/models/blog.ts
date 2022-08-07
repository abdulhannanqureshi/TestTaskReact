import { Schema, model } from 'mongoose';

const BlogSchema = new Schema({

    category: {
        type: Schema.Types.ObjectId,
        ref: 'blogCategory'
    },
    title: {
        type: String,
    },
    slug: {
        type: String,
    },
    description: {
        type: String,
    },
    blogFeatureImage: {
        type: String,
    },
    metaTitle: {
        type: String,
        default: ""
    },
    metaDescriptin: {
        type: String,
        default: ""
    },
    metaKeyword: {
        type: String,
        default: ""
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

export const BlogModel = model('blog', BlogSchema);

