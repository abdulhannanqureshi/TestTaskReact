import { Request, Response } from 'express';
const TalentLMS = require('talentlms');
import {
  UserModel,
  EmailTemplateModel,
  UniversityModel,
  CorporateModel,
  CourseTopicModel,
} from '../../models';
import {
  encryptPassword,
  generateSalt,
  message,
  generatePassword,
} from '../../common';
import { Document, Types } from 'mongoose';
import moment from 'moment';
import { validationResult } from 'express-validator';
import { ValidationFormatter } from '../../common/formatter';
import { Email } from '../../common';

/**
 ---------------------------
    ADD TALENT LMS COURSES
 ---------------------------
 */

/**
 * @api {get} talentLms/add-category  Add talent lms category
 * @apiName addTlmsCategories
 * @apiGroup SuperAdmin
 * @apiPermission Admin
 * @apiDescription To Add talent lms Category
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    message:"Category added successfully",
 *    responseCode: 200
 *    data: result
 *    success: true
 * }
 * @apiErrorExample {json} List error
 * HTTP/1.1 404 NotFound
 
 *    HTTP/1.1 500 Internal Server Error
 */
const gettlmsCourses = async (req: Request, res: Response): Promise<any> => {
  try {
    // const sort: any = { createdAt: -1 };
    const talentLMS = new TalentLMS(
      process.env.TALENTLMSURL,
      process.env.TALENTLMSAPIKEY
    );

    const courses: Document[] | any = await talentLMS.Courses.getCourses();
    //   const Categories: Document[] | any =
    //     await talentLMS.Categories.getCategories();

    return res.status(200).json({
      message: message.listFetchSuccess.replace(':item', 'Courses'),
      success: true,
      responseCode: 200,
      data: courses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error && error.message
          ? error.message
          : message.unexpectedError,
    });
  }
};
/**
 ---------------------------
    ADD TALENT LMS COURSES
 ---------------------------
 */

/**
 * @api {get} talentLms/add-category  Add talent lms category
 * @apiName addTlmsCategories
 * @apiGroup SuperAdmin
 * @apiPermission Admin
 * @apiDescription To Add talent lms Category
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    message:"Category added successfully",
 *    responseCode: 200
 *    data: result
 *    success: true
 * }
 * @apiErrorExample {json} List error
 * HTTP/1.1 404 NotFound
 
 *    HTTP/1.1 500 Internal Server Error
 */
const gettlmsCategories = async (req: Request, res: Response): Promise<any> => {
  try {
    // const sort: any = { createdAt: -1 };
    const talentLMS = new TalentLMS(
      process.env.TALENTLMSURL,
      process.env.TALENTLMSAPIKEY
    );

    //const courses: Document[] | any = await talentLMS.Courses.getCourses();
    const Categories: Document[] | any =
      await talentLMS.Categories.getCategories();

    return res.status(200).json({
      message: message.listFetchSuccess.replace(':item', 'Categories'),
      success: true,
      responseCode: 200,
      data: Categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error && error.message
          ? error.message
          : message.unexpectedError,
    });
  }
};
export { gettlmsCategories, gettlmsCourses };
