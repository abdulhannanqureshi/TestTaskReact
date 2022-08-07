import express from 'express';
import { AddCourseValidation, EditCourseValidation } from '../../validations';
import {
  getCourses,
  addCourse,
  updateCourse,
  viewCourse,
  updateCourseStatus,
  deleteCourse,
  courseBulkAction,
} from '../../controllers/superadmin';
import { ValidateAdminToken } from '../../common';
const CourseRouter: express.Router = express.Router();

CourseRouter.post(
  '/',
  ValidateAdminToken,
  AddCourseValidation,
  addCourse
);

CourseRouter.get('/', ValidateAdminToken, getCourses);

CourseRouter.get('/:id', ValidateAdminToken, viewCourse);
CourseRouter.put('/bulk-action', ValidateAdminToken, courseBulkAction);
CourseRouter.put(
  '/:id',
  ValidateAdminToken,
  EditCourseValidation,
  updateCourse
);

CourseRouter.put('/update-status/:id', ValidateAdminToken, updateCourseStatus);
CourseRouter.delete('/:id', ValidateAdminToken, deleteCourse);

export default CourseRouter;
