import { Request, Response } from 'express';
import { PressReleaseModel, PressReleaseCategoryModel } from '../../models';
import { Document, Types } from 'mongoose';
import moment from 'moment';
import { validationResult } from 'express-validator';
import { ValidationFormatter } from '../../common/formatter';
import { message } from '../../common';

/**
 -----------------------
    ADD PRESS RELEASE 
 -----------------------
 */
/**
 * @api {post} press-release/  Add Press Release
 * @apiName addPressRelease
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Add API for Press Releases
 * @apiParam {String} category category of the Press Release.
 * @apiParam {String} title title of the Press Release.
 * @apiParam {String} description description of the Press Release.
 * @apiParam {String} metaTitle metaTitle of the Press Release.
 * @apiParam {String} metaDescription metaDescription of the Press Release.
 * @apiParam {String} metaKeyword metaKeyword of the Press Release.
 * @apiParamExample {Object} Request-Example:
{
    "category": "612df7b67316b6623761c0e8",
    "title": "A book.",
    "description": "A book is good ",
    "metaTitle": "",
    "metaDescription": "",
    "metaKeyword": ""
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *    responseCode: 200,
      data: result,
      message: 'Press Release added successfully.',
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 *  HTTP/1.1 400 pressReleaseCategory
 * {
 *     code: 400,
        message: "Category not found",
        success: false,
 * }
 *    HTTP/1.1 500 Internal Server Error
 */
const addPressRelease = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { body, file } = req;
    const {
      category,
      title,
      description,
      metaTitle,
      metaDescription,
      metaKeyword,
    } = body;
    const pressReleaseCategory: Document | null | any =
      await PressReleaseCategoryModel.findOne({
        _id: category,
        isDeleted: false,
      });
    if (!pressReleaseCategory) {
      return res.status(400).json({
        code: 400,
        message: message.notFound.replace(':item', 'Category'),
        success: false,
      });
    }

    const data: object = {
      category,
      title,
      description,
      metaTitle,
      metaDescription,
      metaKeyword,
      pressFeatureImage: file ? `uploads/pressRelease/${file.filename}` : '',
    };
    const pressReleaseData: Document = new PressReleaseModel(data);
    const result: any = await pressReleaseData.save();

    return res.status(200).json({
      message: message.addedSuccess.replace(':item', 'Press release'),
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
 ----------------------------
    GET ALL PRESS RELEASES
 ----------------------------
 */

/**
 * @api {get} press-release/  Get Press Release list
 * @apiName getPressRelease
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch Press Release details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   responseCode: 200,
      data: result,
      totalRecords,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const getPressRelease = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query } = req;
    const searchValue: any = query.searchValue || '';
    const isActive: any = query.isActive || '';
    let skip: any = query.skip || 0;
    let limit: any = query.limit || 10;
    const sortBy: any = query.sortBy || '';
    const fromDate: any = query.fromDate || '';
    const toDate: any = query.toDate || '';
    let condition: object = { isDeleted: false };
    let sort: any = { createdAt: -1 };
    skip = (skip - 1) * limit;
    if (limit === 'all') {
      // Sort user name by A-Z
      limit = '0';
    }
    if (sortBy == 1) {
      // Sort user name by A-Z
      sort = {
        title: 1,
      };
    }
    if (searchValue) {
      condition = {
        ...condition,
        $or: [
          {
            'pressReleaseCategory.categoryName': {
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
    // if (isActive !== '') {
    //   condition = { ...condition, isActive };
    // }
    if (isActive === 'true') {
      condition = { ...condition, isActive: true };
    }
    if (isActive === 'false') {
      condition = { ...condition, isActive: false };
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
    // const result: Document[] = await PressReleaseModel.find({
    //   ...condition,
    //   isDeleted: false,
    // })
    const result: Document[] = await PressReleaseModel.aggregate([
      {
        $lookup: {
          from: 'pressreleasecategories',
          as: 'pressReleaseCategory',
          foreignField: '_id',
          localField: 'category',
        },
      },
      {
        $unwind: '$pressReleaseCategory',
      },

      {
        $match: condition,
      },
      {
        $project: {
          title: 1,
          slug: 1,
          description: 1,
          pressFeatureImage: 1,
          metaTitle: 1,
          metaDescriptin: 1,
          metaKeyword: 1,
          isActive: 1,
          createdAt: 1,
          categoryName: '$pressReleaseCategory.categoryName',
        },
      },
      { $sort: sort }, // Use this to sort documents by newest first
      { $skip: parseInt(skip) }, // Always apply 'skip' before 'limit'
      { $limit: parseInt(limit) }, // This is your 'page size'
    ]);
    const totalRecords: Document[] | number | any =
      await PressReleaseModel.aggregate([
        {
          $lookup: {
            from: 'pressreleasecategories',
            as: 'pressReleaseCategory',
            foreignField: '_id',
            localField: 'category',
          },
        },
        {
          $unwind: '$pressReleaseCategory',
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
      success: true,
      message: message.listFetchSuccess.replace(':item', 'Press release'),
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
 ------------------------------
   VIEW PRESS RELEASE DETAILS
 ------------------------------
 */

/**
 * @api {get} press-release/:id  Press Release details
 * @apiName viewPressRelease
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch a Press Release details
 * @apiParam {String} _id id of the Press Release.
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    message:"Press Release details fetched successfully",
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

const viewPressRelease = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;
    const { id }: string | any = params;
    const result: Document | null | any = await PressReleaseModel.findOne({
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
      message: message.viewSuccess.replace(':item', 'Press release'),
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
  UPDATE PRESS RELEASE 
 -----------------------
 */
/**
 * @api {put} press-release/:id  Update Press Release
 * @apiName updatePressRelease
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Update API for Press Release
 * @apiParam {String} category category of the Press Release.
 * @apiParam {String} title title of the Press Release.
 * @apiParam {String} description description of the Press Release.
 * @apiParam {String} metaTitle metaTitle of the Press Release.
 * @apiParam {String} metaDescription metaDescription of the Press Release.
 * @apiParam {String} metaKeyword metaKeyword of the Press Release.
 * @apiParamExample {Object} Request-Example:
{
    "category": "612df7b67316b6623761c0e8",
    "title": "A book.",
    "description": "A book is great ",
    "metaTitle": "",
    "metaDescription": "",
    "metaKeyword": ""
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   responseCode: 200,
      data: result,
      message: 'Press Release details updated successfully.',
      success: true,
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 *  HTTP/1.1 400 pressReleaseCategory
 * {
 *     code: 400,
       message: "Category not found",
      success: false,
 * }
 *    HTTP/1.1 500 Internal Server Error
 */

const updatePressRelease = async (
  req: Request,
  res: Response
): Promise<any> => {
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
      category,
      title,
      description,
      metaTitle,
      metaDescription,
      metaKeyword,
      dropPressFeatureImage,
    } = body;
    const pressReleaseCategory: Document | null | any =
      await PressReleaseCategoryModel.findOne({
        _id: body.category,
        isDeleted: false,
      });
    if (!pressReleaseCategory) {
      return res.status(400).json({
        code: 400,
        message: message.notFound.replace(':item', 'Category'),
        success: false,
      });
    }
    const pressRelease: Document | null | any = await PressReleaseModel.findOne(
      {
        _id: id,
        isDeleted: false,
      }
    );

    let pressFeatureImage: String = pressRelease.pressFeatureImage;
    if (req.file) {
      const file = req.file;
      pressFeatureImage = `uploads/pressRelease/${file.filename}`;
    }
    if (dropPressFeatureImage === 'true' || dropPressFeatureImage === true) {
      pressFeatureImage = '';
    }

    const result: Document = await PressReleaseModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          category,
          title,
          description,
          metaTitle,
          metaDescription,
          metaKeyword,
          pressFeatureImage,
        },
      }
    );

    return res.status(200).json({
      responseCode: 200,
      data: result,
      message: message.updateSuccess.replace(':item', 'Press release details'),
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
 ---------------------------------
    UPDATE PRESS RELEASE STATUS
 ---------------------------------
 */
/**
 * @api {put} /press-release/update-status/:id  Update Press Release status
 * @apiName updatePressReleaseStatus
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription  API for Update Press Release Status
 * @apiParam {Boolean} isActive isActive status of the Press Release.
 * @apiParam {String} id id of the Press Release.
 * @apiParamExample {Object} Request-Example:
{
  isActive: true
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:'Press Release activated successfully!',
 *   responseCode: 200,
 *   data: result,
 *  success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const updatePressReleaseStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body, params } = req;
    const { isActive } = body;
    const { id }: string | any = params;
    const result: Document = await PressReleaseModel.updateOne(
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
        ? message.activeSuccess.replace(':item', 'Press release')
        : message.deactivatedSuccess.replace(':item', 'Press release');
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
    DELETE PRESS RELEASE 
 ---------------------------
 */

/**
 * @api {delete} press-release/:id     Delete Press Release 
 * @apiName deletePressRelease
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To Delete a Press Release  
 * @apiParam {String} _id id of the Press Release.
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    responseCode: 200,
      message: 'Press Release deleted',
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
const deletePressRelease = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { params } = req;

    const { id }: string | any = params;
    const result: Document | null | any = await PressReleaseModel.findOne({
      _id: id,
    });
    if (result == null) {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'Data'),
        success: true,
      });
    }
    await PressReleaseModel.updateOne(
      { _id: id },
      {
        $set: {
          isDeleted: true,
        },
      }
    );
    return res.status(200).json({
      responseCode: 200,
      message: message.deletedSuccess.replace(':item', 'Press release'),
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
     PRESS RELEASE BULK ACTION
 -------------------------------
 */

/**
 * @api {put} press-release/bulk-action      Press Release Bulk Action
 * @apiName pressBulkAction
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To Perform bulk action on Press Release
 * @apiParam {String} ids id of the Press Release.
 * @apiParam {String} type type of action.
 * @apiParamExample {Object} Request-Example:
   {
  ids: ["612df7b67316b6623761c0e4",'612df7b67316b6623761c0e8],
  type:'Delete',

    }
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message:"Press Release deleted successfully",
 *   responseCode: 200,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const pressBulkAction = async (req: Request, res: Response): Promise<any> => {
  try {
    const { ids, type } = req.body;
    let updateData: any = {};
    let msg = '';
    if (type === 'Delete') {
      msg = 'Press Release deleted successfully';
      updateData.isDeleted = true;
    }
    if (type === 'Active') {
      msg = 'Press Release activated successfully';
      updateData.isActive = true;
    }
    if (type === 'Deactive') {
      msg = 'Press Release deactivated successfully';
      updateData.isActive = false;
    }

    await PressReleaseModel.updateMany(
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
  addPressRelease,
  getPressRelease,
  viewPressRelease,
  updatePressRelease,
  updatePressReleaseStatus,
  deletePressRelease,
  pressBulkAction,
};
