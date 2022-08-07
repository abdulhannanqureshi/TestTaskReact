import { Schema, model } from 'mongoose';

const CourseSchema: Schema = new Schema({
  /* title: {
    type: String,
  }, */
  code: {
    type: String,
  },
  /* description: {
    type: String,
  }, */
  price: {
    type: String,
  },
  talentLmsCourseId: {
    type: String,
  },

  title: {
    type: String,
  },
  subTitle: {
    type: String,
  },
  description: {
    type: String,
  },

  topic: {
    type: Schema.Types.ObjectId,
    ref: 'courseTopic',
  },
  bannerImage: {
    type: String,
  },
  bodySection1: {
    type: String,
  },
  bodySection2: {
    type: String,
  },
  bodySection3: {
    type: String,
  },
  bodySection4: {
    type: String,
  },
  bodySectionImage1: {
    type: String,
  },
  bodySectionImage2: {
    type: String,
  },
  bodySectionImage3: {
    type: String,
  },
  bodySectionImage4: {
    type: String,
  },
  media: {
    type: String,
  },
  // duration: {
  //   type: String,
  // },
  // courseOverview: {
  //   type: String,
  // },
  // courseOverviewImage: {
  //   type: String,
  // },
  // whatsCovered: {
  //   type: String,
  // },
  // whatsCoveredImage: {
  //   type: String,
  // },
  // teams: {
  //   type: String,
  // },
  // teamsImage: {
  //   type: String,
  // },
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

export const CourseModel = model('course', CourseSchema);
