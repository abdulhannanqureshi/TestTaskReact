import { Request, Response } from 'express';
import { CourseModel, ModuleModel } from '../../models';
import moment from 'moment';
import { Document, Types } from 'mongoose';
import { validationResult } from 'express-validator';
import { ValidationFormatter } from '../../common/formatter';
import { message } from '../../common';

/**
 -----------------------
       ADD MODULE 
 -----------------------
 */
/**
 * @api {post} module/  Add Module
 * @apiName addModule
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription API for add Module
 * @apiParam {String} moduleName Name of the Module.
 * @apiParam {String} course id of the course.
 * @apiParam {String} category category of the Module.
 * @apiParam {String} amount amount of the Module.
 * @apiParamExample {Object} Request-Example:
{
   "moduleName": "basic math",
    "course": "math",
    "category": "basic",
    "amount": "500",
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:'Module added successfully.',
 *   responseCode: 200,
 *   data: result,
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 *  HTTP/1.1 400 CourseNotFound
 * {
 *    message: "Course not found",
 *  responseCode: 400,
 *  success: false
 * }
 *    HTTP/1.1 500 Internal Server Error
 */
const addModule = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { body } = req;
    const { moduleName, course, category, amount } = body;
    const courseData: Document | null | any = await CourseModel.findOne({
      _id: course,
    });

    if (!courseData) {
      return res.status(400).json({
        code: 400,
        message: message.notFound.replace(':item', 'Course'),
        success: false,
      });
    }

    const data: object = {
      moduleName,
      course,
      category,
      amount,
    };
    const moduleData: Document = new ModuleModel(data);
    const result: any = await moduleData.save();

    return res.status(200).json({
      message: message.addedSuccess.replace(':item', 'Module'),
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
      GET ALL MODULES
 -------------------------
 */

/**
 * @api {get} module/  Get Module list
 * @apiName getModules
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch Module details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 * message: Module list fetched successfully
 *   responseCode: 200,
      data: result,
      totalRecords,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const getModules = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query } = req;
    const searchValue: any = query.searchValue || '';
    const isActive: any = query.isActive || '';
    let skip: any = query.skip || 1;
    let limit: any = query.limit || 10;
    const sortBy: any = query.sortBy || '';
    const fromDate: any = query.fromDate || '';
    const toDate: any = query.toDate || '';
    let condition: object = { isDeleted: false };
    let sort: any = { _id: -1 };
    skip = (skip - 1) * limit;
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
    if (limit === 'all') {
      // Sort user name by A-Z
      limit = '0';
    }
    if (searchValue) {
      condition = {
        ...condition,
        $or: [
          {
            'course.title': {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
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
          {
            code: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            code: searchValue,
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
        $match: condition,
      },
      {
        $project: {
          moduleName: 1,
          amount: 1,
          code: 1,
          category: 1,
          isActive: 1,
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
          $match: condition,
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

/**
 ---------------------------
    VIEW MODULE DETAILS
 ---------------------------
 */

/**
 * @api {get} module/:id  Module details
 * @apiName viewModule
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch Module details
 * @apiParam {String} id id of the Module.
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    responseCode: 200
 *    data: result
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

const viewModule = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;

    const { id }: string | any = params;
    const result: Document | null | any = await ModuleModel.findOne({
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
      message: message.viewSuccess.replace(':item', 'Module'),
      responseCode: 200,
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
     UPDATE MODULE 
 -----------------------
 */
/**
 * @api {put} module/:id  Update Module
 * @apiName updateModule
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Update API for Module
 * @apiParam {String} moduleName Name of the Module.
 * @apiParam {String} course id of the course.
 * @apiParam {String} category category of the Module.
 * @apiParam {String} amount amount of the Module.
 * @apiParam {String} id id of the Module.
 * @apiParamExample {Object} Request-Example:
{
   "moduleName": "basic math",
    "course": "math",
    "category": "basic",
    "amount": "100",
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:'Module details updated successfully.',
 *   responseCode: 200,
 *   data: result,
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 *  HTTP/1.1 400 CourseNotFound
 * {
 *    message:"Course not found",
 *  success: false
 * }
 *    HTTP/1.1 500 Internal Server Error
 */

const updateModule = async (req: Request, res: Response): Promise<any> => {
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
    const courseData: Document | null | any = await CourseModel.findOne({
      _id: body.course,
    });
    if (!courseData) {
      return res.status(400).json({
        code: 400,
        message: message.notFound.replace(':item', 'Course'),
        success: false,
      });
    }

    const result: Document = await ModuleModel.updateOne(
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
      message: message.updateSuccess.replace(':item', 'Module'),
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
  UPDATE MODULE STATUS
 -----------------------
 */
/**
 * @api {put} /module/update-status/:id  Update Module status
 * @apiName updateModuleStatus
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription  API for Update Module Status
 * @apiParam {Boolean} isActive isActive status of the Module.
 * @apiParam {String} id id of the Module.
 * @apiParamExample {Object} Request-Example:
{
  isActive: true
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:'Module activated successfully!',
 *   responseCode: 200,
 *   data: result,
 *  success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const updateModuleStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body, params } = req;
    const { isActive } = body;
    const { id }: string | any = params;
    const result: Document = await ModuleModel.updateOne(
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
      isActive === 'true'
        ? message.activeSuccess.replace(':item', 'Module')
        : message.deactivatedSuccess.replace(':item', 'Module');
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
        DELETE MODULE
 ---------------------------
 */

/**
 * @api {delete} module/:id   Delete Module
 * @apiName deleteModule
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To Delete a Module
 * @apiParam {String} _id id of the Module
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    responseCode: 200,
      message: 'Module deleted',
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

const deleteModule = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;

    const { id }: string | any = params;
    const result: Document | null | any = await ModuleModel.findOne({
      _id: id,
    });
    if (result == null) {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'Data'),
        success: true,
      });
    }
    await ModuleModel.updateOne(
      { _id: id },
      {
        $set: {
          isDeleted: true,
        },
      }
    );
    return res.status(200).json({
      responseCode: 200,
      message: message.deletedSuccess.replace(':item', 'Module'),
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
      MODULE BULK ACTION
 -------------------------------
 */

/**
 * @api {put} module/bulk-action      Module Bulk Action
 * @apiName moduleBulkAction
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To Perform bulk action on Module
 * @apiParam {String} ids id of the Module.
 * @apiParam {String} type type of action.
 * @apiParamExample {Object} Request-Example:
   {
  ids: ["612df7b67316b6623761c0e4",'612df7b67316b6623761c0e8],
  type:'Delete',

    }
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message:"Module deleted successfully",
 *   responseCode: 200,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const moduleBulkAction = async (req: Request, res: Response): Promise<any> => {
  try {
    const { ids, type } = req.body;
    let updateData: any = {};
    let msg = '';
    if (type === 'Delete') {
      msg = 'Module deleted successfully';
      updateData.isDeleted = true;
    }
    if (type === 'Active') {
      msg = 'Module activated successfully';
      updateData.isActive = true;
    }
    if (type === 'Deactive') {
      msg = 'Module deactivated successfully';
      updateData.isActive = false;
    }

    await ModuleModel.updateMany(
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
export {
  addModule,
  getModules,
  viewModule,
  updateModule,
  updateModuleStatus,
  deleteModule,
  moduleBulkAction,
};
