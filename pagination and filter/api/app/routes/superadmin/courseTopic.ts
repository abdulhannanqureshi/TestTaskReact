import express from 'express';
import {
  getCourseTopics,
  addCourseTopic,
  updateCourseTopic,
  viewCourseTopic,
  updateCourseTopicStatus,
  deleteCourseTopic,
  categoryBulkAction,
} from '../../controllers/superadmin';
import { ValidateAdminToken, upload } from '../../common';
import {
  AddCourseTopicValidation,
  EditCourseTopicValidation,
} from '../../validations';
const CourseTopicRouter: express.Router = express.Router();

// CourseTopicRouter.get("/", getCourseTopics);

CourseTopicRouter.post(
  '/',
  ValidateAdminToken,
  upload.fields([
    { name: 'bannerImage', maxCount: 1 },
    { name: 'certificateImage', maxCount: 1 },
    { name: 'bodySectionImage1', maxCount: 1 },
    { name: 'bodySectionImage2', maxCount: 1 },
    { name: 'bodySectionImage3', maxCount: 1 },
    { name: 'bodySectionImage4', maxCount: 1 },
  ]),
  AddCourseTopicValidation,
  addCourseTopic
);
CourseTopicRouter.post('/bulk-action', ValidateAdminToken, categoryBulkAction);

CourseTopicRouter.get('/', ValidateAdminToken, getCourseTopics);

CourseTopicRouter.get('/:id', ValidateAdminToken, viewCourseTopic);
CourseTopicRouter.put(
  '/:id',
  ValidateAdminToken,
  upload.fields([
    { name: 'bannerImage', maxCount: 1 },
    { name: 'certificateImage', maxCount: 1 },
    { name: 'bodySectionImage1', maxCount: 1 },
    { name: 'bodySectionImage2', maxCount: 1 },
    { name: 'bodySectionImage3', maxCount: 1 },
    { name: 'bodySectionImage4', maxCount: 1 },
  ]),
  EditCourseTopicValidation,
  updateCourseTopic
);
CourseTopicRouter.put(
  '/update-status/:id',
  ValidateAdminToken,
  updateCourseTopicStatus
);
CourseTopicRouter.delete('/:id', ValidateAdminToken, deleteCourseTopic);

export default CourseTopicRouter;
