import { Request, Response } from 'express';
import { CourseModel, CourseTopicModel } from '../../models';
import { Document, Types } from 'mongoose';
import moment from 'moment';
import { validationResult } from 'express-validator';
import { ValidationFormatter } from '../../common/formatter';
import { message } from '../../common';

/**
 -----------------------
     ADD COURSE
 -----------------------
 */
/**
 * @api {post} course/  Add Course
 * @apiName addCourse
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Add API for add Course
 * @apiParam {String} title title of the Course.
 * @apiParam {String} topic topic of the Course.
 * @apiParam {String} price Price of the Course.

 
 * @apiParamExample {Object} Request-Example:
{
        "title": "math", 
        "price":'2000',
        "topic":"618142d498bdc911c47e385a",  
       
       
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *    responseCode: 200,
      data: result,
      message: 'Course added successfully.',
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 *    HTTP/1.1 500 Internal Server Error
 */
const addCourse = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { body } = req;
    const { title, price, topic } = body;
    const courseTopic: Document | null | any = await CourseTopicModel.findOne({
      _id: topic,
    });

    if (!courseTopic) {
      return res.status(400).json({
        code: 400,
        message: message.notFound.replace(':item', 'Topic'),
        success: false,
      });
    }

    const data: object = {
      title,
      price,
      topic,
    };
    const courseData: Document = new CourseModel(data);
    const result: any = await courseData.save();

    return res.status(200).json({
      message: message.addedSuccess.replace(':item', 'Course'),
      responseCode: 200,
      data: result,
    });
  } catch (error) {
    console.log(error);
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
      GET ALL COURSE
 -------------------------
 */

/**
 * @api {get} course/  Get Course list
 * @apiName getCourses
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch Course details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   responseCode: 200,
 *   message:"Course list fetched successfully",
      data: result,
      totalRecords,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const getCourses = async (req: Request, res: Response): Promise<any> => {
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
            price: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            code: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            code: searchValue,
          },
          {
            'topics.topicName': {
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

    let queryBuilder = [];

    queryBuilder.push(
      {
        $lookup: {
          from: 'coursetopics',
          as: 'topics',
          foreignField: '_id',
          localField: 'topic',
        },
      },
      {
        $unwind: '$topics',
      },
      {
        $match: condition,
      },
      {
        $project: {
          title: 1,
          price: 1,
          isActive: 1,
          code: 1,
          topicName: '$topics.topicName',
        },
      }
    );
    queryBuilder.push({ $sort: sort });
    queryBuilder.push({ $skip: parseInt(skip) });
    if (limit !== 'all') queryBuilder.push({ $limit: parseInt(limit) });

    const result: Document[] | any = await CourseModel.aggregate(queryBuilder);
    const totalRecords: Document[] | any = await CourseModel.aggregate([
      {
        $lookup: {
          from: 'coursetopics',
          as: 'topics',
          foreignField: '_id',
          localField: 'topic',
        },
      },
      {
        $unwind: '$topics',
      },
      {
        $match: condition,
      },
      {
        $count: 'count',
      },
    ]);
    return res.status(200).json({
      responseCode: 200,
      message: message.listFetchSuccess.replace(':item', 'Course'),
      data: result,
      totalRecords:
        totalRecords && totalRecords.length ? totalRecords[0].count : 0,
      success: true,
    });
  } catch (error) {
    console.log(error);
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
    VIEW COURSE DETAILS
 ---------------------------
 */

/**
 * @api {get} course/:id  Course details
 * @apiName viewCourse
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch Course details
 * @apiParam {String} id id of the Course.
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    responseCode: 200,
 *  message: "Course details fetched successfully",
 *    data: result,
 *    success: true
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

const viewCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;

    const { id }: string | any = params;
    const result: Document | null | any = await CourseModel.findOne({
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
      message: message.viewSuccess.replace(':item', 'Course'),
      data: result,
      success: true,
    });
  } catch (error) {
    console.log(error);
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
      UPDATE COURSE 
 -----------------------
 */
/**
 * @api {put} course/:id  Update Course
 * @apiName updateCourse
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Update API for Course
 * @apiParam {String} title title of the Course.
 * @apiParam {String} topic topic of the Course.
 * @apiParam {String} price Price of the Course.
 * @apiParamExample {Object} Request-Example:
{
        "title": "math", 
        "price":'1000',
        "topic":"618142d498bdc911c47e385a",  
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:'Course details updated successfully.',
 *   responseCode: 200,
 *   data: result,
 *   success: true
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 *  HTTP/1.1 400 TopicNotFound
 * {
 *    message: "Topic not found",
 *  success: false
 * }
 *    HTTP/1.1 500 Internal Server Error
 */
const updateCourse = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { body, params } = req;
    const { id }: string | any = params;
    const course: Document | null | any = await CourseModel.findOne({
      _id: id,
    });

    const courseTopic: Document | null | any = await CourseTopicModel.findOne({
      _id: body.topic,
    });
    if (!courseTopic) {
      return res.status(400).json({
        code: 400,
        message: message.notFound.replace(':item', 'Topic'),
        success: false,
      });
    }

    const result: Document = await CourseModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          ...body,
        },
      }
    );

    return res.status(200).json({
      responseCode: 200,
      data: result,
      message: message.updateSuccess.replace(':item', 'Course Details'),
      success: true,
    });
  } catch (error) {
    console.log(error);
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
  UPDATE COURSE STATUS
 -----------------------
 */
/**
 * @api {put} /course/update-status/:id  Update Course status
 * @apiName updateCourseStatus
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription  API for Update Course Status
 * @apiParam {Boolean} isActive isActive status of the Course.
 * @apiParam {String} id id of the Course.
 * @apiParamExample {Object} Request-Example:
{
  isActive: true
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:'Course activated successfully!',
 *   responseCode: 200,
 *   data: result,
 *  success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const updateCourseStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body, params } = req;
    const { isActive } = body;
    const { id }: string | any = params;
    const result: Document = await CourseModel.updateOne(
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
        ? message.activeSuccess.replace(':item', 'Course')
        : message.deactivatedSuccess.replace(':item', 'Course');
    return res.status(200).json({
      responseCode: 200,
      data: result,
      message: text,
      success: true,
    });
  } catch (error) {
    console.log(error);
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
        DELETE COURSE 
 ---------------------------
 */

/**
 * @api {delete} course/:id     Delete Course 
 * @apiName deleteCourse
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To Delete Course profile 
 * @apiParam {String} _id id of the Course.
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    responseCode: 200,
      message: 'Course deleted successfully',
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

const deleteCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;

    const { id }: string | any = params;
    const result: Document | null | any = await CourseModel.findOne({
      _id: id,
    });
    if (result == null) {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'Data'),
        success: true,
      });
    }
    // await CourseModel.deleteOne({ _id: id })
    await CourseModel.updateOne(
      { _id: id },
      {
        $set: {
          isDeleted: true,
        },
      }
    );
    return res.status(200).json({
      responseCode: 200,
      message: message.deletedSuccess.replace(':item', 'Course'),
      success: true,
    });
  } catch (error) {
    console.log(error);
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
        COURSE BULK ACTION
 -------------------------------
 */

/**
 * @api {put} course/bulk-action      Course Bulk Action
 * @apiName CourseBulkAction
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To Perform bulk action on Course
 * @apiParam {String} ids id of the Course.
 * @apiParam {String} type type of action.
 * @apiParamExample {Object} Request-Example:
   {
  ids: ["612df7b67316b6623761c0e4",'612df7b67316b6623761c0e8],
  type:'Delete',

    }
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message:"Course deleted successfully",
 *   responseCode: 200,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const courseBulkAction = async (req: Request, res: Response): Promise<any> => {
  try {
    const { ids, type } = req.body;
    let updateData: any = {};
    let msg = '';
    if (type === 'Delete') {
      msg = 'Course deleted successfully';
      updateData.isDeleted = true;
    }
    if (type === 'Active') {
      msg = 'Course activated successfully';
      updateData.isActive = true;
    }
    if (type === 'Deactive') {
      msg = 'Course deactivated successfully';
      updateData.isActive = false;
    }

    await CourseModel.updateMany(
      {
        _id: {
          $in: ids.map(function (value: any) {
            return Types.ObjectId(value);
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
/**
 ------------------------------
    GET ALL AVAILABLE COURSES
 ------------------------------
 */

/**
 * @api {get} course/available-course  Get Course list
 * @apiName getAvailableCourses
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch Course details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   responseCode: 200,
 *   message:"Course list fetched successfully",
      data: result,
      totalRecords,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

/* const getAvailableCourses = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    let condition: object = { isActive: true, isDeleted: false };
    let sort: any = { createdAt: -1 };

    const result: Document[] | any = await CourseModel.find(
      {
        ...condition,
      },
      {
        _id: 1,
        title: 1,
      }
    ).sort(sort);

    return res.status(200).json({
      message: message.listFetchSuccess.replace(':item', 'Course'),
      responseCode: 200,
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        error instanceof Error && error.message
          ? error.message
          : message.unexpectedError,
      success: false,
    });
  }
}; */
export {
  addCourse,
  getCourses,
  viewCourse,
  updateCourse,
  updateCourseStatus,
  deleteCourse,
  courseBulkAction,
  // getAvailableCourses,
};
