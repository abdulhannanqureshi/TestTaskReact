import { Schema, model } from 'mongoose';

const MarketSchema: Schema = new Schema({
  title: {
    type: String,
    default: '',
  },
  titleSlug: {
    type: String,
    default: '',
  },
  bannerTitle: {
    type: String,
    default: '',
  },
  marketBannerImage: {
    type: String,
    default: '',
  },
  block1: {
    type: String,
    default: '',
  },
  blockTitle1: {
    type: String,
    default: '',
  },
  blockImage1: {
    type: String,
    default: '',
  },
  block2: {
    type: String,
    default: '',
  },
  blockTitle2: {
    type: String,
    default: '',
  },
  blockImage2: {
    type: String,
    default: '',
  },
  block3: {
    type: String,
    default: '',
  },
  blockTitle3: {
    type: String,
    default: '',
  },
  blockImage3: {
    type: String,
    default: '',
  },
  block4: {
    type: String,
    default: '',
  },
  blockTitle4: {
    type: String,
    default: '',
  },
  blockImage4: {
    type: String,
    default: '',
  },
  block5: {
    type: String,
    default: '',
  },
  blockTitle5: {
    type: String,
    default: '',
  },
  blockImage5: {
    type: String,
    default: '',
  },
  block6: {
    type: String,
    default: '',
  },
  blockTitle6: {
    type: String,
    default: '',
  },
  blockImage6: {
    type: String,
    default: '',
  },
  block7: {
    type: String,
    default: '',
  },
  blockTitle7: {
    type: String,
    default: '',
  },
  blockImage7: {
    type: String,
    default: '',
  },
  block8: {
    type: String,
    default: '',
  },
  blockTitle8: {
    type: String,
    default: '',
  },
  blockImage8: {
    type: String,
    default: '',
  },
  block9: {
    type: String,
    default: '',
  },
  blockTitle9: {
    type: String,
    default: '',
  },
  blockImage9: {
    type: String,
    default: '',
  },
  block10: {
    type: String,
    default: '',
  },
  blockTitle10: {
    type: String,
    default: '',
  },
  blockImage10: {
    type: String,
    default: '',
  },
  blockTitle11: {
    type: String,
    default: '',
  },
  blockTitle12: {
    type: String,
    default: '',
  },
  blockTitle13: {
    type: String,
    default: '',
  },
  blockTitle14: {
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

export const MarketingModel = model('marketing', MarketSchema);
