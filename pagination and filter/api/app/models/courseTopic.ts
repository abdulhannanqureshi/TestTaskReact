import { Schema, model } from 'mongoose';

const CourseTopicSchema = new Schema({
  topicName: {
    type: String,
  },

  talentLmsCategoryId: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  subTitle: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  /* topic: {
    type: Schema.Types.ObjectId,
    ref: 'courseTopic',
  }, */
  bannerImage: {
    type: String,
    default: '',
  },
  bodySection1: {
    type: String,
    default: '',
  },
  bodySection2: {
    type: String,
    default: '',
  },
  bodySection3: {
    type: String,
    default: '',
  },
  bodySection4: {
    type: String,
    default: '',
  },
  certificateImage: {
    type: String,
    default: '',
  },
  bodySectionImage1: {
    type: String,
    default: '',
  },
  bodySectionImage2: {
    type: String,
    default: '',
  },
  bodySectionImage3: {
    type: String,
    default: '',
  },
  bodySectionImage4: {
    type: String,
    default: '',
  },
  media: {
    type: String,
    default: '',
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
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const CourseTopicModel = model('courseTopic', CourseTopicSchema);
