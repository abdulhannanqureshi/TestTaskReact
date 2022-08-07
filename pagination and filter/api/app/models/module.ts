import { Schema, model } from "mongoose";

const ModuleSchema: Schema = new Schema({
  moduleName: {
    type: String,
  },
  code: {
    type: String,
  },
  description: {
    type: String,
  },
  amount: {
    type: Number,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "course",
  },
  category: {
    type: String,
  },
  talentLmsCourseId: {
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
    ref: "user",
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
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

export const ModuleModel = model("module", ModuleSchema);
