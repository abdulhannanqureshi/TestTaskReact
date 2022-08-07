import { Request, Response } from 'express';
import moment from 'moment';
import { LabsModel, CourseTopicModel, CourseModel } from '../../models';
import { Document, Types } from 'mongoose';
import { validationResult } from 'express-validator';
import { ValidationFormatter } from '../../common/formatter';
import { message } from '../../common';
import Mongoose from 'mongoose';
/**
 -----------------------
       ADD LABS 
 -----------------------
 */
/**
 * @api {post} lab/  Add Lab
 * @apiName addLab
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Add API for Labs
 * @apiParam {String} category category of the Lab.
 * @apiParam {String} title title of the Lab.
 * @apiParam {String} amount Amount of the Lab.
 * @apiParam {String} description description of the Lab.
 * @apiParamExample {Object} Request-Example:
{
    "category": "612df7b67316b6623761c0e8",
    "title": "A book.",
    "amount": "A book.",
    "description": "A book is good ",
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *    responseCode: 200,
      data: result,
      message: 'Lab added successfully.',
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 *  HTTP/1.1 400 labCategory
 * {
 *     code: 400,
        message: "Category not found",
        success: false,
 * }
 *    HTTP/1.1 500 Internal Server Error
 */
const addLab = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { body, file } = req;
    const { course, amount, title, description, link } = body;
    console.log(body, 'this is body');
    const lab: Document | null | any = await LabsModel.findOne({
      course: course,
      isDeleted: false,
    });
    if (lab) {
      return res.status(400).json({
        code: 400,
        message: 'Lab is already exist for this course',
        success: false,
      });
    }
    const labCategory: Document | null | any = await CourseModel.findOne({
      _id: course,
      isDeleted: false,
    });
    if (!labCategory) {
      return res.status(400).json({
        code: 400,
        message: message.notFound.replace(':item', 'Course'),
        success: false,
      });
    }

    const data: object = {
      course,
      title,
      description,
      amount,
      link,
      labsImage: file ? `uploads/labs/${file.filename}` : '',
    };

    const labData: Document = new LabsModel(data);
    const result: any = await labData.save();

    return res.status(200).json({
      responseCode: 200,
      data: result,
      message: message.addedSuccess.replace(':item', 'Lab'),
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
      GET ALL LABS
 -------------------------
 */

/**
 * @api {get} lab/  Get lab list
 * @apiName getLabs
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch labs details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message: Lab list fetched successfully
 *   responseCode: 200,
      data: result,
      totalRecords,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const getLabs = async (req: Request, res: Response): Promise<any> => {
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
    let sort: any = { createdAt: -1 };
    skip = (skip - 1) * limit;
    if (sortBy == 1) {
      // Sort user name by A-Z
      sort = {
        title: 1,
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
            'labCategory.title': {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            title: {
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

    const result: Document[] | any = await LabsModel.aggregate([
      {
        $lookup: {
          from: 'courses',
          as: 'labCategory',
          foreignField: '_id',
          localField: 'course',
        },
      },
      {
        $unwind: '$labCategory',
      },
      {
        $match: condition,
      },
      {
        $project: {
          title: 1,

          description: 1,
          labsImage: 1,
          course: 1,
          amount: 1,
          link: 1,
          courseName: '$labCategory.title',
          isActive: 1,
          createdAt: 1,
          // categoryName: '$labCategory.categoryName',
        },
      },
      { $sort: sort }, // Use this to sort documents by newest first
      { $skip: parseInt(skip) }, // Always apply 'skip' before 'limit'
      { $limit: parseInt(limit) }, // This is your 'page size'
    ]);
    const totalRecords: Document[] | number | any = await LabsModel.aggregate([
      {
        $lookup: {
          from: 'courses',
          as: 'labCategory',
          foreignField: '_id',
          localField: 'course',
        },
      },
      {
        $unwind: '$labCategory',
      },
      {
        $match: condition,
      },

      { $count: 'count' },
    ]);

    return res.status(200).json({
      responseCode: 200,
      message: message.listFetchSuccess.replace(':item', 'Lab'),
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
      VIEW LABS DETAILS
 ---------------------------
 */

/**
 * @api {get} lab/:id  Lab details
 * @apiName viewLab
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch a Lab details
 * @apiParam {String} _id id of the Lab.
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    message:"Lab details fetched successfully",
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

const viewLab = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;
    const { id }: string | any = params;
    // const result: Document | null | any = await LabsModel.findOne({
    //   _id: id,
    //   isDeleted: false,
    // });
    const result: Document[] | any = await LabsModel.aggregate([
      {
        $lookup: {
          from: 'courses',
          as: 'labCategory',
          foreignField: '_id',
          localField: 'course',
        },
      },
      {
        $unwind: '$labCategory',
      },
      {
        $match: {
          _id: Types.ObjectId(id),
        },
      },
      {
        $project: {
          title: 1,

          description: 1,
          labsImage: 1,
          course: 1,
          amount: 1,
          link: 1,
          courseName: '$labCategory.title',
          isActive: 1,
          createdAt: 1,
          // categoryName: '$labCategory.categoryName',
        },
      },
    ]);
    if (result === null) {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'Data'),
        success: true,
      });
    }
    return res.status(200).json({
      message: message.viewSuccess.replace(':item', 'Lab'),
      responseCode: 200,
      data: result.length === 1 ? result[0] : null,
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
       UPDATE LABS 
 -----------------------
 */
/**
 * @api {put} lab/:id  Update Lab
 * @apiName updateLab
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Update API for Lab
 * @apiParam {String} category category of the Lab.
 * @apiParam {String} title title of the Lab.
 * @apiParam {String} amount Amount of the Lab.
 * @apiParam {String} description description of the Lab.
 * @apiParamExample {Object} Request-Example:
{
    "category": "612df7b67316b6623761c0e8",
    "title": "A book.",
    "amount": "300",
    "description": "A book is great "
 
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   responseCode: 200,
      data: result,
      message: 'Lab details updated successfully.',
      success: true,
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 *  HTTP/1.1 400 labCategory
 * {
 *     code: 400,
       message: "Category not found",
      success: false,
 * }
 *    HTTP/1.1 500 Internal Server Error
 */

const updateLab = async (req: Request, res: Response): Promise<any> => {
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
    const {
      course,
      title,
      amount,
      link,
      description,

      dropLabFeatureImage,
    } = body;
    const labCategory: Document | null | any = await CourseModel.findOne({
      _id: body.course,
      isDeleted: false,
    });
    if (!labCategory) {
      return res.status(400).json({
        code: 400,
        message: message.notFound.replace(':item', 'Course'),
        success: false,
      });
    }
    const lab: Document | null | any = await LabsModel.findOne({
      _id: id,
      isDeleted: false,
    });

    let labsImage: String = lab.labsImage;

    if (req.file) {
      const file = req.file;
      labsImage = `uploads/labs/${file.filename}`;
    }

    if (dropLabFeatureImage === 'true' || dropLabFeatureImage === true) {
      labsImage = '';
    }

    const result: Document = await LabsModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          course,
          title,
          amount,
          description,
          link,
          labsImage,
        },
      }
    );

    return res.status(200).json({
      responseCode: 200,
      data: result,
      message: message.updateSuccess.replace(':item', 'Lab Details'),
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
    UPDATE LABS STATUS
 -----------------------
 */
/**
 * @api {put} /lab/update-status/:id  Update Lab status
 * @apiName updateLabStatus
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription  API for Update Lab Status
 * @apiParam {Boolean} isActive isActive status of the Lab.
 * @apiParam {String} id id of the Lab.
 * @apiParamExample {Object} Request-Example:
{
  isActive: true
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:'Lab activated successfully!',
 *   responseCode: 200,
 *   data: result,
 *  success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const updateLabStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body, params } = req;
    const { isActive } = body;
    const { id }: string | any = params;
    const result: Document = await LabsModel.updateOne(
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
        ? message.activeSuccess.replace(':item', 'Lab')
        : message.deactivatedSuccess.replace(':item', 'Lab');
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
        DELETE LABS 
 ---------------------------
 */

/**
 * @api {delete} lab/:id     Delete Lab 
 * @apiName deleteLab
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To Delete a Lab  
 * @apiParam {String} _id id of the Lab.
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    responseCode: 200,
      message: 'Lab deleted',
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
const deleteLab = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;

    const { id }: string | any = params;
    const result: Document | null | any = await LabsModel.findOne({ _id: id });
    if (result === null) {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'Data'),
        success: true,
      });
    }
    // await LabsModel.deleteOne({ _id: id })
    await LabsModel.updateOne(
      { _id: id },
      {
        $set: {
          isDeleted: true,
        },
      }
    );
    return res.status(200).json({
      responseCode: 200,
      message: message.deletedSuccess.replace(':item', 'Lab'),
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
        LABS BULK ACTION
 -------------------------------
 */

/**
 * @api {put} lab/bulk-action      Lab Bulk Action
 * @apiName labBulkAction
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To Perform bulk action on labs
 * @apiParam {String} ids id of the Labs.
 * @apiParam {String} type type of action.
 * @apiParamExample {Object} Request-Example:
   {
  ids: ["612df7b67316b6623761c0e4",'612df7b67316b6623761c0e8],
  type:'Delete',

    }
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message:"Lab deleted successfully",
 *   responseCode: 200,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const labBulkAction = async (req: Request, res: Response): Promise<any> => {
  try {
    const { ids, type } = req.body;
    let updateData: any = {};
    let msg = '';
    if (type === 'Delete') {
      msg = 'Lab deleted successfully';
      updateData.isDeleted = true;
    }
    if (type === 'Active') {
      msg = 'Lab activated successfully';
      updateData.isActive = true;
    }
    if (type === 'Deactive') {
      msg = 'Lab deactivated successfully';
      updateData.isActive = false;
    }

    await LabsModel.updateMany(
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
  addLab,
  getLabs,
  viewLab,
  updateLab,
  updateLabStatus,
  deleteLab,
  labBulkAction,
};
