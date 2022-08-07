import express from 'express';
import {
  getCourses,
  viewCourse,
  getPurchasedCourses,
} from '../../controllers/frontend';
import { ValidateUserToken } from '../../common';
const CourseRouter: express.Router = express.Router();
CourseRouter.get('/purchased-course', ValidateUserToken, getPurchasedCourses);
CourseRouter.get('/:id', viewCourse);
CourseRouter.get('/', getCourses);

export default CourseRouter;
