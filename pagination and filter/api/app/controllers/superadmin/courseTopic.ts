import { Request, Response } from 'express';
import { CourseTopicModel } from '../../models';
import { Document, Types } from 'mongoose';
import { validationResult } from 'express-validator';
import { ValidationFormatter } from '../../common/formatter';
import { message } from '../../common';
import moment from 'moment';
import Mongoose from 'mongoose';

/**
 -------------------------
   GET ALL COURSE TOPICS
 -------------------------
 */

/**
 * @api {get} courseTopic/  Get Course Topic list
 * @apiName getCourseTopics
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch Course Topic details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   responseCode: 200,
 *   message:"Course Topic list fetched successfully",
      data: result,
      totalRecords,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
// const getCourseTopics = async (req: Request, res: Response): Promise<any> => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(422).json({
//       message: ValidationFormatter(errors.mapped()),
//       success: false,
//     });
//   }
//   try {
//     const result: Document[] = await CourseTopicModel.find({
//       // isDeleted: false,
//       // isActive: true,
//     });
//     return res.status(200).json({
//       message: message.listFetchSuccess.replace(':item', 'Course Topic'),
//       responseCode: 200,
//       data: result,
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: error instanceof Error && error.message ? error.message : message.unexpectedError,
//       success: false,
//     });
//   }
// };

/**
 -----------------------
     ADD COURSE TOPIC
 -----------------------
 */
/**
 * @api {post} course-topic/       Add Course Topic
 * @apiName addCourseTopic
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Add API for add Course Topic
 * @apiParam {String} title title of the Course Topic.
 * @apiParam {String} topicName Name of the Course Topic.
 * @apiParam {String} description Description of the Course Topic.
 * @apiParam {String} media Media of the Course Topic.
 * @apiParam {String} subTitle Sub Title of the Course Topic.
 * @apiParam {String} bodySection1 body of Section1 of the Course Topic.
 * @apiParam {String} bannerImage Banner Image of the Course Topic.
 * @apiParam {String} bodySectionImage1 bodySectionImage1 of the Course Topic.
 * @apiParam {String} bodySection2 body of Section2 of the Course Topic.
 * @apiParam {String} bodySectionImage2 bodySectionImage2 of the Course Topic.
 * @apiParam {String} bodySection3 body of Section3 of the Course Topic.
 * @apiParam {String} bodySectionImage3 bodySectionImage3 of the Course Topic.
 * @apiParam {String} bodySection4 body of Section4 of the Course Topic.
 * @apiParam {String} bodySectionImage4 bodySectionImage4 of the Course Topic.
 
 * @apiParamExample {Object} Request-Example:
{
        "title": "math", 
        "subTitle": "algebra", 
        "description":"text",
        "media":"www.xyz.com",
        "topicName":"algebra",  
        "bodySection1":"algebra is important", 
        "bodySection2":"algebra is important", 
        "bodySection3":"algebra is important", 
        "bodySection4":"algebra is important", 
        "bannerImage":"text",
        "bodySectionImage1":"text",
        "bodySectionImage2":"text",
        "bodySectionImage3":"text",
        "bodySectionImage4":"text",
       
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *    responseCode: 200,
      data: result,
      message: 'Category added successfully.',
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 *    HTTP/1.1 500 Internal Server Error
 */
const addCourseTopic = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { body } = req;
    const {
      title,
      subTitle,
      topicName,
      description,
      media,
      bodySection1,
      bodySection2,
      bodySection3,
      bodySection4,
    } = body;
    let bannerImage: String = '';
    let certificateImage: String = '';
    let bodySectionImage1: String = '';
    let bodySectionImage2: String = '';
    let bodySectionImage3: String = '';
    let bodySectionImage4: String = '';

    if (req.files) {
      const files = req.files;
      for (const [key, value] of Object.entries(files)) {
        switch (key) {
          case 'certificateImage':
            certificateImage = `uploads/badgeImages/${value[0].filename}`;
            break;
          case 'bannerImage':
            bannerImage = `uploads/course/${value[0].filename}`;
            break;
          case 'bodySectionImage1':
            bodySectionImage1 = `uploads/course/${value[0].filename}`;
            break;
          case 'bodySectionImage2':
            bodySectionImage2 = `uploads/course/${value[0].filename}`;
            break;
          case 'bodySectionImage4':
            bodySectionImage4 = `uploads/course/${value[0].filename}`;
            break;
          case 'bodySectionImage3':
            bodySectionImage3 = `uploads/course/${value[0].filename}`;
            break;
          default:
            break;
        }
      }
    }

    const data: object = {
      title,
      description,
      media,
      topicName,
      subTitle,
      bodySection1,
      bodySection2,
      bodySection3,
      bodySection4,
      bannerImage,
      certificateImage,
      bodySectionImage1,
      bodySectionImage2,
      bodySectionImage3,
      bodySectionImage4,
    };
    const courseTopicData: Document = new CourseTopicModel(data);
    const result: any = await courseTopicData.save();

    return res.status(200).json({
      message: message.addedSuccess.replace(':item', 'Category'),
      responseCode: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error && error.message
          ? error.message
          : message.unexpectedError,
      success: false,
    });
  }
};
/**
 -------------------------
   GET ALL COURSE TOPICS
 -------------------------
 */

/**
 * @api {get} course-topic/       Get Course Topic list
 * @apiName getCourseTopics
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch Course Topic list 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   responseCode: 200,
 *   message:"Category list fetched successfully",
      data: result,
      totalRecords,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const getCourseTopics = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query } = req;
    const searchValue: any = query.searchValue || '';
    const isActive: any = query.isActive || '';
    let skip: any = query.skip || 0;
    let limit: any = query.limit || 10;
    const fromDate: any = query.fromDate || '';
    const toDate: any = query.toDate || '';
    const sortBy: any = query.sortBy || '';
    let condition: object = { isDeleted: false };
    let sort: any = { _id: -1 };
    skip = (skip - 1) * (limit === 'all' ? 0 : limit);

    if (searchValue) {
      condition = {
        $or: [
          {
            title: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            subTitle: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            topicName: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
        ],
      };
    }
    let dateCondition = {};
    if (fromDate != null && toDate != null) {
      dateCondition = {
        $gte: moment(fromDate).toDate(),
        $lte: moment(toDate).toDate(),
      };
    }
    if (fromDate && toDate) {
      condition = {
        ...condition,
        createdAt: dateCondition,
      };
    }
    if (isActive === 'true') {
      condition = { ...condition, isActive: true };
    }
    if (isActive === 'false') {
      condition = { ...condition, isActive: false };
    }
    const totalRecords: number = await CourseTopicModel.countDocuments({
      ...condition,
      isDeleted: false,
    });

    let queryBuilder = [];

    queryBuilder.push(
      {
        $match: condition,
      },
      {
        $project: {
          title: 1,
          subTitle: 1,
          isActive: 1,
          topicName: 1,
        },
      }
    );
    queryBuilder.push({ $sort: sort });
    queryBuilder.push({ $skip: parseInt(skip) });
    if (limit !== 'all') queryBuilder.push({ $limit: parseInt(limit) });

    const result: Document[] | any = await CourseTopicModel.aggregate(
      queryBuilder
    );

    return res.status(200).json({
      responseCode: 200,
      message: message.listFetchSuccess.replace(':item', 'Category'),
      data: result,
      totalRecords,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error && error.message
          ? error.message
          : message.unexpectedError,
      success: false,
    });
  }
};
/**
 -------------------------
   GET A COURSE TOPICS
 -------------------------
 */

/**
 * @api {get} course-topic/:id       Get Course Topic details
 * @apiName viewCourseTopic
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch Course Topic details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   responseCode: 200,
 *   message:"Category details fetched successfully",
      data: result,
      totalRecords,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const viewCourseTopic = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;

    const { id }: string | any = params;
    const result: Document | null | any = await CourseTopicModel.findOne({
      _id: id,
    });
    if (result == null) {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'Data'),
        success: true,
      });
    }
    return res.status(200).json({
      responseCode: 200,
      message: message.viewSuccess.replace(':item', 'Category'),
      data: result,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error && error.message
          ? error.message
          : message.unexpectedError,
      success: false,
    });
  }
};
/**
 -----------------------
   UPDATE COURSE TOPIC
 -----------------------
 */
/**
 * @api {put} course-topic/:id       Update Course Topic
 * @apiName updateCourseTopic
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Add API for add Course Topic
 * @apiParam {String} title title of the Course Topic.
 * @apiParam {String} topicName Name of the Course Topic.
 * @apiParam {String} description Description of the Course Topic.
 * @apiParam {String} media Media of the Course Topic.
 * @apiParam {String} subTitle Sub Title of the Course Topic.
 * @apiParam {String} bodySection1 body of Section1 of the Course Topic.
 * @apiParam {String} bodySection2 body of Section2 of the Course Topic.
 * @apiParam {String} bodySection3 body of Section3 of the Course Topic.
 * @apiParam {String} bodySection4 body of Section4 of the Course Topic.
 
 * @apiParamExample {Object} Request-Example:
{
        "title": "math", 
        "subTitle": "algebra", 
        "description":"text",
        "media":"www.xyz.com",
        "topicName":"algebra",  
        "bodySection1":"algebra is important", 
        "bodySection2":"algebra is important", 
        "bodySection3":"algebra is important", 
        "bodySection4":"algebra is important", 
       
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *    responseCode: 200,
      data: result,
      message: 'Category details updated successfully.',
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 *    HTTP/1.1 500 Internal Server Error
 */
const updateCourseTopic = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { body, params } = req;
    const {
      title,
      subTitle,
      topicName,
      description,
      media,
      bodySection1,
      bodySection2,
      bodySection3,
      bodySection4,
      dropBannerImage,
      dropCertificateImage,
      dropBodySectionImage1,
      dropBodySectionImage2,
      dropBodySectionImage3,
      dropBodySectionImage4,
    } = body;

    const { id }: string | any = params;
    const courseTopic: Document | null | any = await CourseTopicModel.findOne({
      _id: id,
    });

    let bannerImage: String = courseTopic.bannerImage;
    let certificateImage: String = courseTopic.certificateImage;

    let bodySectionImage1: String = courseTopic.bodySectionImage1;
    let bodySectionImage2: String = courseTopic.bodySectionImage2;
    let bodySectionImage3: String = courseTopic.bodySectionImage3;
    let bodySectionImage4: String = courseTopic.bodySectionImage4;

    if (req.files) {
      const files = req.files;
      for (const [key, value] of Object.entries(files)) {
        switch (key) {
          case 'certificateImage':
            certificateImage = `uploads/badgeImages/${value[0].filename}`;
            break;
          case 'bannerImage':
            bannerImage = `uploads/course/${value[0].filename}`;
            break;
          case 'bodySectionImage1':
            bodySectionImage1 = `uploads/course/${value[0].filename}`;

            break;
          case 'bodySectionImage2':
            bodySectionImage2 = `uploads/course/${value[0].filename}`;

            break;
          case 'bodySectionImage3':
            bodySectionImage3 = `uploads/course/${value[0].filename}`;

            break;
          case 'bodySectionImage4':
            bodySectionImage4 = `uploads/course/${value[0].filename}`;

            break;
          default:
            break;
        }
      }
    }

    if (dropCertificateImage === true || dropCertificateImage === 'true') {
      certificateImage = '';
    }
    if (dropBannerImage === true || dropBannerImage === 'true') {
      bannerImage = '';
    }
    if (dropBodySectionImage1 === true || dropBodySectionImage1 === 'true') {
      bodySectionImage1 = '';
    }
    if (dropBodySectionImage2 === true || dropBodySectionImage2 === 'true') {
      bodySectionImage2 = '';
    }
    if (dropBodySectionImage3 === true || dropBodySectionImage3 === 'true') {
      bodySectionImage3 = '';
    }
    if (dropBodySectionImage4 === true || dropBodySectionImage4 === 'true') {
      bodySectionImage4 = '';
    }

    const result: Document = await CourseTopicModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          title,
          subTitle,
          topicName,
          description,
          media,
          bodySection1,
          bodySection2,
          bodySection3,
          bodySection4,
          bannerImage,
          certificateImage,
          bodySectionImage1,
          bodySectionImage2,
          bodySectionImage3,
          bodySectionImage4,
        },
      }
    );

    return res.status(200).json({
      responseCode: 200,
      data: result,
      message: message.updateSuccess.replace(':item', 'Category details'),
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error && error.message
          ? error.message
          : message.unexpectedError,
      success: false,
    });
  }
};
/**
 -----------------------------------
     UPDATE COURSE Topic STATUS
 -----------------------------------
 */
/**
 * @api {put} /course-topic/update-status/:id  Update Course Topic status
 * @apiName updateCourseTopicStatus
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription  API for Update Course Status
 * @apiParam {Boolean} isActive isActive status of the Course Topic.
 * @apiParam {String} id id of the Course.
 * @apiParamExample {Object} Request-Example:
{
  isActive: true
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:'Category activated successfully!',
 *   responseCode: 200,
 *   data: result,
 *  success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const updateCourseTopicStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body, params } = req;
    const { isActive } = body;
    const { id }: string | any = params;
    const result: Document = await CourseTopicModel.updateOne(
      {
        _id: { $in: id },
      },
      {
        $set: {
          isActive: isActive,
        },
      }
    );
    const text: string =
      isActive === true
        ? message.activeSuccess.replace(':item', 'Category')
        : message.deactivatedSuccess.replace(':item', 'Category');
    return res.status(200).json({
      responseCode: 200,
      data: result,
      message: text,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error && error.message
          ? error.message
          : message.unexpectedError,
      success: false,
    });
  }
};

/**
 ---------------------------
    DELETE COURSE TOPIC 
 ---------------------------
 */

/**
 * @api {delete} course-topic/:id     Delete Course Topic
 * @apiName deleteCourseTopic
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To Delete Course Topic  
 * @apiParam {String} _id id of the Course Topic.
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    responseCode: 200,
      message: 'Category deleted successfully',
      success: true,
 * }
 * @apiErrorExample {json} List error
 * HTTP/1.1 404 NotFound
 * {
 *    message: "Data not found.",
 *  responseCode: 404,
 *  success: false
 * }
 *    HTTP/1.1 500 Internal Server Error
 */
const deleteCourseTopic = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;

    const { id }: string | any = params;
    const result: Document | null | any = await CourseTopicModel.findOne({
      _id: id,
    });
    if (result == null) {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'Data'),
        success: true,
      });
    }
    await CourseTopicModel.updateOne(
      { _id: id },
      {
        $set: {
          isDeleted: true,
        },
      }
    );
    return res.status(200).json({
      responseCode: 200,
      message: message.deletedSuccess.replace(':item', 'Category'),
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error && error.message
          ? error.message
          : message.unexpectedError,
      success: false,
    });
  }
};

/**
 -------------------------------
     COURSE TOPIC BULK ACTION
 -------------------------------
 */

/**
 * @api {post} course-topic/bulk-action      Course Topic Bulk Action
 * @apiName categoryBulkAction
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To Perform bulk action on Course Topic
 * @apiParam {String} ids id of the Course Topic.
 * @apiParam {String} type type of action.
 * @apiParamExample {Object} Request-Example:
   {
  ids: ["612df7b67316b6623761c0e4",'612df7b67316b6623761c0e8],
  type:'Delete',

    }
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message:"Course Topic deleted successfully",
 *   responseCode: 200,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const categoryBulkAction = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { ids, type } = req.body;
    let updateData: any = {};
    let msg = '';
    if (type === 'Delete') {
      msg = 'Category deleted successfully';
      updateData.isDeleted = true;
    }
    if (type === 'Active') {
      msg = 'Category activated successfully';
      updateData.isActive = true;
    }
    if (type === 'Deactive') {
      msg = 'Category deactivated successfully';
      updateData.isActive = false;
    }

    await CourseTopicModel.updateMany(
      {
        _id: {
          $in: ids.map(function (value: any) {
            return Mongoose.Types.ObjectId(value);
          }),
        },
      },
      {
        $set: updateData,
      }
    );

    return res.status(200).json({
      message: msg,
      success: true,
      responseCode: 200,
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

export {
  addCourseTopic,
  getCourseTopics,
  viewCourseTopic,
  updateCourseTopic,
  updateCourseTopicStatus,
  deleteCourseTopic,
  categoryBulkAction,
};
