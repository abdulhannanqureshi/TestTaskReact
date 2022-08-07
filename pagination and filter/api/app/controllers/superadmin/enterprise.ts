import { Request, Response } from 'express';
import { EnterpriseModel } from '../../models';
import moment from 'moment';
import { Document, Types } from 'mongoose';
import { validationResult } from 'express-validator';
import { ValidationFormatter } from '../../common/formatter';
import { message as messages } from '../../common';

/**
 -----------------------
     ADD ENTERPRISE
 -----------------------
 */
/**
 * @api {post} enterprise/  Add Enterprise
 * @apiName addEnterprise
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Add API for Enterprise
 * @apiParam {String} contactNumber contactNumber of the Enterprise.
 * @apiParam {String} firstName firstName of the Enterprise.
 * @apiParam {String} email email of the Enterprise.
 * @apiParam {String} lastName lastName of the Enterprise.
 * @apiParam {String} mobileNumber mobileNumber of the Enterprise.
 * @apiParam {String} message message by the Enterprise.
 * @apiParamExample {Object} Request-Example:
{
     "firstName": "jon",
    "lastName": "doe",
    "mobileNumber": "9824433224",
    "contactNumber": "9924433224",
    "message": "message is here"
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *    responseCode: 200,
      data: result,
      message: 'Enterprise added successfully.',
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 *    HTTP/1.1 500 Internal Server Error
 */
const addEnterprise = async (req: Request, res: Response): Promise<any> => {
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
      email,
      firstName,
      lastName,
      mobileNumber,
      contactNumber,
      message,
      topics,
    } = body;

    const data: object = {
      firstName,
      lastName,
      mobileNumber,
      contactNumber,
      message,
      topics,
      email: email.toLowerCase(),
    };
    const enterpriseData: Document = new EnterpriseModel(data);
    const result: any = await enterpriseData.save();

    return res.status(200).json({
      message: ' Your Enquiry Submitted Successfully', //messages.addedSuccess.replace(':item', 'Enterprise'),

      responseCode: 200,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        error instanceof Error && error.message
          ? error.message
          : messages.unexpectedError,
      success: false,
    });
  }
};

/**
 -------------------------
      GET ALL ENTERPRISE
 -------------------------
 */

/**
 * @api {get} enterprise/  Get Enterprise list
 * @apiName getEnterprises
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch Enterprise details 
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

const getEnterprises = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query } = req;
    const searchValue: any = query.searchValue || '';
    const isActive: any = query.isActive || '';
    let skip: any = query.skip || 0;
    let limit: any = query.limit || 10;
    const fromDate: any = query.fromDate || '';
    const toDate: any = query.toDate || '';
    const sortBy: any = query.sortBy || '';
    let condition: object = {};
    let sort: any = { createdAt: -1 };
    skip = (skip - 1) * limit;
    if (sortBy == 1) {
      // Sort user name by A-Z
      sort = {
        firstName: 1,
      };
    }
    if (searchValue) {
      condition = {
        $or: [
          {
            firstName: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            lastName: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            email: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            contactNumber: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            message: {
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
    if (limit === 'all') {
      // Sort user name by A-Z
      limit = '0';
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
    const totalRecords: number = await EnterpriseModel.countDocuments({
      ...condition,
      isDeleted: false,
    });
    const result: Document[] = await EnterpriseModel.find({
      ...condition,
      isDeleted: false,
    })
      .sort(sort)
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    return res.status(200).json({
      responseCode: 200,
      message: messages.listFetchSuccess.replace(':item', 'Enterprise'),
      data: result,
      totalRecords,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        error instanceof Error && error.message
          ? error.message
          : messages.unexpectedError,
      success: false,
    });
  }
};

/**
 ---------------------------
   VIEW ENTERPRISE DETAILS
 ---------------------------
 */

/**
 * @api {get} enterprise/:id  Enterprise details
 * @apiName viewEnterprise
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch Enterprise details
 * @apiParam {String} id id of the Enterprise.
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

const viewEnterprise = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;
    const { id }: string | any = params;
    const result: Document | null | any = await EnterpriseModel.findOne({
      _id: id,
    });
    if (result == null) {
      return res.status(404).json({
        responseCode: 404,
        message: messages.notFound.replace(':item', 'Data'),
        success: true,
      });
    }
    return res.status(200).json({
      responseCode: 200,
      message: messages.viewSuccess.replace(':item', 'Enterprise'),
      data: result,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        error instanceof Error && error.message
          ? error.message
          : messages.unexpectedError,
      success: false,
    });
  }
};

/**
 ---------------------------
    DELETE ENTERPRISE
 ---------------------------
 */

/**
 * @api {delete} enterprise/:id   Delete Enterprise
 * @apiName deleteEnterprise
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To Delete a Enterprise
 * @apiParam {String} _id id of the Enterprise
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    responseCode: 200,
      message: 'Enterprise deleted',
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

const deleteEnterprise = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;

    const { id }: string | any = params;
    const result: Document | null | any = await EnterpriseModel.findOne({
      _id: id,
    });
    if (result == null) {
      return res.status(404).json({
        responseCode: 404,
        message: messages.notFound.replace(':item', 'Data'),
        success: true,
      });
    }
    await EnterpriseModel.updateOne(
      { _id: id },
      {
        $set: {
          isDeleted: true,
        },
      }
    );
    return res.status(200).json({
      responseCode: 200,
      message: messages.deletedSuccess.replace(':item', 'Enterprise'),
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        error instanceof Error && error.message
          ? error.message
          : messages.unexpectedError,
      success: false,
    });
  }
};

export { addEnterprise, getEnterprises, viewEnterprise, deleteEnterprise };
