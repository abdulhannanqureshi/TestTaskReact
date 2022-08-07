import { Request, Response } from 'express';
import { Document, Types } from 'mongoose';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import { validationResult } from 'express-validator';
import { ValidationFormatter } from '../../common/formatter';
import { message } from '../../common';
import { PromoModel } from '../../models';
import moment from 'moment';

/**
 -----------------------
       ADD PROMO
 -----------------------
 */
/**
 * @api {post} promo-code/  Add Promo Code
 * @apiName addPromo
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Add API for Add Promo Code
 * @apiParam {String} percentOff value of percentage off in promo.
 * @apiParam {String} endDate Expire Date of the promo.
 * @apiParam {String} startDate Start Date of the promo.
 * @apiParam {String} promoTitle title of the promo.
 * @apiParam {String} promoCode code of the promo.
 * @apiParamExample {Object} Request-Example:
 {
       "percentOff":"20",
        "endDate":"2021/12/10",
        "startDate":"2021/12/08",
        "promoTitle":20-OFF,
        "promoCode"20OFF:
     }
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:'Promo code added successfully.',
 *   responseCode: 200,
 *   data: result,
 * }
 * @apiErrorExample {json} List error
 *   HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 *    HTTP/1.1 500 Internal Server Error
 */

const addPromo = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { body } = req;
    const { percentOff, endDate, startDate, promoTitle, promoCode } = body;
    let { courseId } = body;

    if (courseId === 'null' || courseId === null) {
      courseId = null;
    }
    const promoCodeField: Document | null | any = await PromoModel.findOne({
      promoCode: promoCode,
    });

    if (promoCodeField) {
      return res.status(400).json({
        code: 400,
        message: message.alreadyExists.replace(':item', 'Promo code'),
        success: false,
      });
    }
    const data: object = {
      percentOff,
      courseId,
      endDate,
      promoTitle,
      promoCode,
      startDate,
    };
    const promoData: Document = new PromoModel(data);
    const promo: any = await promoData.save();

    return res.status(200).json({
      message: message.addedSuccess.replace(':item', 'Promo code'),
      responseCode: 200,
      data: promo,
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
       UPDATE PROMO
 -----------------------
 */
/**
 * @api {put} promo-code/:id  Update Promo Code
 * @apiName updatePromo
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription  API for Update Promo
 * @apiParam {String} percentOff value of percentage off in promo.
 * @apiParam {String} endDate Expire Date of the promo.
 * @apiParam {String} startDate Start Date of the promo.
 * @apiParam {String} promoTitle title of the promo.
 * @apiParam {String} promoCode code of the promo.
 * @apiParamExample {Object} Request-Example:
 {
        "percentOff":"20",
        "endDate":"2021/12/10",
        "startDate":"2021/12/08",
        "promoTitle":20-OFF,
        "promoCode"20OFF:
     }
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:'Promo Code updated Successfully.',
 *   responseCode: 200,
 *   data: result,
 * }
 * @apiErrorExample {json} List error
 * *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 *    HTTP/1.1 500 Internal Server Error
 */

const updatePromo = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { body, params } = req;
    const { percentOff, endDate, startDate, promoTitle, promoCode } = body;
    let { courseId } = body;
    if (courseId === 'null' || courseId === null) {
      courseId = null;
    }
    const { id }: string | any = params;
    const promoCodeField: Document | null | any = await PromoModel.findOne({
      promoCode: promoCode,
      _id: { $ne: id },
    });

    if (promoCodeField) {
      return res.status(400).json({
        code: 400,
        message: message.alreadyExists.replace(':item', 'Promo code'),
        success: false,
      });
    }
    const promo: Document | any = await PromoModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          percentOff,
          endDate,
          startDate,
          promoTitle,
          courseId,
          promoCode,
        },
      }
    );

    return res.status(200).json({
      message: message.updateSuccess.replace(':item', 'Promo code'),
      responseCode: 200,
      data: promo,
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
    GET PROMOS LIST
 -----------------------
 */
/**
 * @api {get} promo-code/  Get Promo Code list
 * @apiName listPromo
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription  API for get Promo list
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   responseCode: 200,
 *   message:"Promo Code list fetched successfully",
      data: promo,
      totalRecords,
      success: true,
 * }
 * @apiErrorExample {json} List error
 *    HTTP/1.1 500 Internal Server Error
 */

const listPromo = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query } = req;
    const searchValue: any = query.searchValue || '';
    const isActive: any = query.isActive || '';
    let skip: any = query.skip || 1;
    let limit: any = query.limit || 10;
    const sortBy: any = query.sortBy || '';
    const fromDate: any = query.startDate || '';
    const toDate: any = query.endDate || '';
    let condition: object = { isDeleted: false };
    let sort: any = { createdAt: -1 };
    skip = (skip - 1) * limit;
    let dateCondition = {};
    // if (fromDate != null && toDate != null) {
    //   dateCondition =
    // }
   
    if (fromDate && fromDate !== "null" && toDate ==="null" ) {
      condition = {
        ...condition,
        startDate: {
          $gt: moment.utc(fromDate).startOf('day').toDate(),
          $lt: moment.utc(fromDate).endOf('day').toDate(),
        },
      };
    }

    if (toDate && toDate !== "null" && fromDate ==="null") {
      console.log("insider1")
      condition = {
        ...condition,
        $and:[
          {
            endDate:{
              $gte: moment.utc(toDate).startOf('day').toDate()},
          } ,
          
          {
            endDate: {$lte: moment.utc(toDate).endOf('day').toDate()}
          }
          
        ]
      };
    }
    if (fromDate && toDate && fromDate !== 'null' && toDate !== 'null' )  {
      condition = {
        ...condition,
        $and:[
          {
            startDate:{
              $gte: moment.utc(fromDate).startOf('day').toDate()},
          } ,
          
          {
            endDate: {$lte: moment.utc(toDate).endOf('day').toDate()}
          }
          
        ]
  
      };
    }
    
    if (searchValue) {
      condition = {
        ...condition,
        $or: [
          {
            promoTitle: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            promoCode: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            percentOff: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            'course.courseName': {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
        ],
      };
    }
    if (limit === 'all') {
      // Sort user name by A-Z
      limit = '0';
    }
    if (isActive === 'true') {
      condition = { ...condition, isActive: true };
    }
    if (isActive === 'false') {
      condition = { ...condition, isActive: false };
    }

    const result: Document[] = await PromoModel.aggregate([
      
      {
        $lookup: {
          from: 'courses',
          as: 'course',
          foreignField: '_id',
          localField: 'courseId',
        },
      },
      {
        $unwind: {
          path: '$course',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: condition,
      },
      {
        $project: {
          promoTitle: 1,
          promoCode: 1,
          percentOff: 1,
          isActive: 1,
          isDeleted: 1,
          createdAt: 1,
          endDate: 1,
          startDate: 1,
          courseName: '$course.title',
        },
      },
      { $sort: sort }, // Use this to sort documents by newest first
      { $skip: parseInt(skip) }, // Always apply 'skip' before 'limit'
      { $limit: parseInt(limit) }, // This is your 'page size'
    ]);
    const totalRecords: Document[] | any = await PromoModel.aggregate([
      {
        $lookup: {
          from: 'courses',
          as: 'course',
          foreignField: '_id',
          localField: 'courseId',
        },
      },
      {
        $unwind: {
          path: '$course',
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $match: condition,
      },
      {
        $count: 'count',
      },
    ]);

    return res.status(200).json({
      message: message.listFetchSuccess.replace(':item', 'Promo code'),
      responseCode: 200,
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
 -----------------------
      GET A PROMO
 -----------------------
 */
/**
 * @api {get} promo-code/:id  Get a Promo Code Details
 * @apiName viewPromos
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription  API for get Promo Details
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *     responseCode: 200,
 *    message: "Promo Code details fetched successfully",
 *    data: promo,
 *    success: true
 * }
 * @apiErrorExample {json} List error
 *    HTTP/1.1 500 Internal Server Error
 */

const viewPromo = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;

    const { id }: string | any = params;
    const result: Document | null | any = await PromoModel.findOne({ _id: id });
    if (result === null) {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'Data'),
        success: true,
      });
    }
    return res.status(200).json({
      message: message.viewSuccess.replace(':item', 'Promo code'),
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
 ---------------------------
        DELETE PROMO
 ---------------------------
 */

/**
 * @api {delete} promo-code/:id     Delete Promo Code
 * @apiName deletePromo
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To Delete a Promo
 * @apiParam {String} promoCode Code of the promo.
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    responseCode: 200,
      message: 'Promo Code deleted Successfully',
 * }
 * @apiErrorExample {json} List error
 *    HTTP/1.1 500 Internal Server Error
 */
const deletePromo = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;
    const { id }: string | any = params;
    const result: Document | null | any = await PromoModel.findOne({ _id: id });
    if (result == null) {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'Data'),
        success: true,
      });
    }
    await PromoModel.updateOne(
      { _id: id },
      {
        $set: {
          isDeleted: true,
        },
      }
    );
    return res.status(200).json({
      message: message.deletedSuccess.replace(':item', 'Promo code'),
      responseCode: 200,
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
  UPDATE PROMO STATUS
 -----------------------
 */
/**
 * @api {put} /promo-code/update-status/:id  Update Promo status
 * @apiName updatePromoStatus
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription  API for Update Module Status
 * @apiParam {Boolean} isActive isActive status of the Promo.
 * @apiParam {String} id id of the Promo.
 * @apiParamExample {Object} Request-Example:
{
  isActive: true
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:'Promo activated successfully!',
 *   responseCode: 200,
 *   data: result,
 *  success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const updatePromoStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body, params } = req;
    const { isActive } = body;
    const { id }: string | any = params;
    const result: Document = await PromoModel.updateOne(
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
        ? message.activeSuccess.replace(':item', 'Promo code')
        : message.deactivatedSuccess.replace(':item', 'Promo code');
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
 -------------------------------
     PROMO CODE BULK ACTION
 -------------------------------
 */

/**
 * @api {put} promo-code/bulk-action      Promo Code Bulk Action
 * @apiName promoBulkAction
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To Perform bulk action on Promo Code
 * @apiParam {String} ids id of the Promo Code.
 * @apiParam {String} type type of action.
 * @apiParamExample {Object} Request-Example:
   {
  ids: ["612df7b67316b6623761c0e4",'612df7b67316b6623761c0e8],
  type:'Delete',

    }
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message:"Promo Code deleted successfully",
 *   responseCode: 200,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const promoBulkAction = async (req: Request, res: Response): Promise<any> => {
  try {
    const { ids, type } = req.body;
    let updateData: any = {};
    let msg = '';
    if (type === 'Delete') {
      msg = 'Promo deleted successfully';
      updateData.isDeleted = true;
    }
    if (type === 'Active') {
      msg = 'Promo activated successfully';
      updateData.isActive = true;
    }
    if (type === 'Deactive') {
      msg = 'Promo deactivated successfully';
      updateData.isActive = false;
    }

    await PromoModel.updateMany(
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
  addPromo,
  listPromo,
  viewPromo,
  deletePromo,
  updatePromo,
  updatePromoStatus,
  promoBulkAction,
};
