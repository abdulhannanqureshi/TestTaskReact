import { Request, Response } from 'express';
import { CourseModel, ModuleModel } from '../../models';
import { Document, Types } from 'mongoose';
import { validationResult } from 'express-validator';
import { ValidationFormatter } from '../../common/formatter';
import { message } from '../../common';

/**
 -------------------------
      GET ALL MODULES
 -------------------------
 */

/**
 * @api {get} module/  Get Module list
 * @apiName getModules
 * @apiGroup Frontend
 * @apiPermission user
 * @apiDescription To fetch Module details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message: Module list fetched successfully
 *   responseCode: 200,
      data: result,
      totalRecords,
      success: true,
 * }
 * @apiErrorExample {json}  error
 * *  HTTP/1.1 400 BadRequest
 * {
 *  message: "Course is Required",
 *   success: false
 *}
 *    HTTP/1.1 500 Internal Server Error
 */

const getModules = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query } = req;
    const searchValue: any = query.searchValue || '';
    const isActive: any = query.isActive || '';
    const courseId: any = query.courseId || '';
    const skip: any = query.skip || 0;
    let limit: any = query.limit || 10;
    const sortBy: any = query.sortBy || '';

    if (courseId === 'null' || courseId === '' || courseId === null) {
      return res.status(400).json({
        message: message.required.replace(':item', 'Course'),
        success: false,
      });
    }
    if (limit === 'all') {
      // Sort user name by A-Z
      limit = '0';
    }
    let condition: object = {
      course: Types.ObjectId(courseId),
      isDeleted: false,
    };
    let sort: any = { createdAt: -1 };

    if (sortBy == 1) {
      // Sort user name by A-Z
      sort = {
        moduleName: 1,
      };
    } else if (sortBy == 2) {
      sort = {
        createdAt: -1,
      };
    }
    if (searchValue) {
      condition = {
        ...condition,
        $or: [
          {
            moduleName: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            category: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
        ],
      };
    }
    // if (isActive !== '') {
    //   condition = { ...condition, isActive };
    // }

    if (isActive === 'true') {
      condition = { ...condition, isActive: true };
    }
    if (isActive === 'false') {
      condition = { ...condition, isActive: false };
    }
    const result: Document[] | any = await ModuleModel.aggregate([
      {
        $match: condition,
      },
      {
        $lookup: {
          from: 'courses',
          as: 'course',
          foreignField: '_id',
          localField: 'course',
        },
      },
      {
        $unwind: '$course',
      },

      {
        $project: {
          moduleName: 1,
          amount: 1,
          category: 1,
          courseName: '$course.title',
        },
      },
      { $sort: sort }, // Use this to sort documents by newest first
      { $skip: parseInt(skip) }, // Always apply 'skip' before 'limit'
      { $limit: parseInt(limit) }, // This is your 'page size'
    ]);
    const totalRecords: Document[] | number | any = await ModuleModel.aggregate(
      [
        {
          $match: condition,
        },
        {
          $lookup: {
            from: 'courses',
            as: 'course',
            foreignField: '_id',
            localField: 'course',
          },
        },
        {
          $unwind: '$course',
        },

        { $count: 'count' },
      ]
    );
    return res.status(200).json({
      message: message.listFetchSuccess.replace(':item', 'Module'),
      responseCode: 200,
      success: true,
      data: result,
      totalRecords:
        totalRecords && totalRecords.length ? totalRecords[0].count : 0,
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
export { getModules };
