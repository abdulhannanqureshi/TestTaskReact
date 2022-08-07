import { Schema, model } from 'mongoose';

const cmsSchema = new Schema({
  pageName: {
    type: String,
  },
  title: {
    type: String,
  },
  content: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
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
  // name: {
  //   type: String,
  //   default: "homePage"
  // },
  // mainSection:
  // {
  //   type: new Schema({
  //     image: String,
  //     title: String,
  //     content: String,
  //     buttonText: String
  //   })
  // },
  // howItWorks: {
  //   type: new Schema({
  //     title: String,
  //     /* section: {
  //       type: [new Schema({
  //         heading: String,
  //         image: String,
  //         title: String,
  //         content: String,
  //       })]
  //     }, */
  //     buttonText: String
  //   })
  // },
  // ourStory: {
  //   type: new Schema({
  //     heading: String,
  //     title: String,
  //     content: String,
  //     videoLink: String
  //   })
  // },
  // why: {
  //   type: new Schema({
  //     heading: String,
  //     /* section: {
  //       type: [new Schema({
  //         title: String,
  //         image: String,
  //         content: {
  //           type: [new Schema({
  //             text: String
  //           })]
  //         }
  //       })]
  //     } */
  //   })
  // }
});

export const cmsModel = model('cms', cmsSchema);
