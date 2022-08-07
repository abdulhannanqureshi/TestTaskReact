import { Request, Response } from 'express';
import { CorporateModel } from '../../models';
import moment from 'moment';
import { Document, Types } from 'mongoose';
import { validationResult } from 'express-validator';
import { ValidationFormatter } from '../../common/formatter';
import { message as messages } from '../../common';

/**
 -----------------------
      ADD CORPORATE
 -----------------------
 */
/**
 * @api {post} corporate/  Add Corporate
 * @apiName addCorporate
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Add API for Corporate
 * @apiParam {String} name contactNumber of the Corporate.
 * @apiParamExample {Object} Request-Example:
{
     "name": "information technology",
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *    responseCode: 200,
      data: result,
      message: 'Corporate added successfully.',
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 *    HTTP/1.1 500 Internal Server Error
 */
const addCorporate = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { body } = req;
    const { name } = body;
    const nameExist: Document | null | any = await CorporateModel.findOne({
      name: {
        $regex: new RegExp(name.trim(), 'i'),
      },
      isDeleted: false,
    });
    if (nameExist) {
      return res.status(400).json({
        code: 400,
        message: messages.alreadyExists.replace(':item', 'Corporate Name'),
        success: false,
      });
    }
    const data: object = {
      name,
    };
    const corporateData: Document = new CorporateModel(data);
    const result: any = await corporateData.save();

    return res.status(200).json({
      message: messages.addedSuccess.replace(':item', 'Corporate'),
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
 -----------------------
    UPDATE CORPORATE
 -----------------------
 */
/**
 * @api {put} corporate/:id      Update Corporate
 * @apiName updateCorporate
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Update API for Corporate
 * @apiParam {String} id id of the Corporate.
 * @apiParam {String} name name of the Corporate.
 * @apiParamExample {Object} Request-Example:
{
     "name": "Account",
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *    responseCode: 200,
      data: result,
      message: 'Corporate updated successfully.',
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 * HTTP/1.1 404 NotFount
 * {
 *     responseCode: 404,
        message: "Corporate not found",
        success: false,
 * }
 *    HTTP/1.1 500 Internal Server Error
 */
const updateCorporate = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { params, body } = req;

    const { id }: string | any = params;

    const { name }: string | any = body;

    const result: Document | null | any = await CorporateModel.findOne({
      _id: id,
      isDeleted: false,
    });
    if (result == null) {
      return res.status(404).json({
        responseCode: 404,
        message: messages.notFound.replace(':item', 'Data'),
        success: true,
      });
    }
    const data: Document | null | any = await CorporateModel.updateOne(
      { _id: id },
      {
        $set: {
          name,
        },
      }
    );

    return res.status(200).json({
      responseCode: 200,
      message: messages.updateSuccess.replace(':item', 'Corporate'),
      data,
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
 -------------------------
   GET ALL CORPORATE
 -------------------------
 */

/**
 * @api {get} corporate/  Get Corporate list
 * @apiName getCorporateList
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch Corporate details
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   responseCode: 200,
 *     message: 'Corporate list fetched successfully',
      data: result,
      totalRecords,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const getCorporateList = async (req: Request, res: Response): Promise<any> => {
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
        name: 1,
      };
    }
    if (searchValue) {
      condition = {
        $or: [
          {
            name: {
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

    if (isActive === 'true') {
      condition = { ...condition, isActive: true };
    }
    if (isActive === 'false') {
      condition = { ...condition, isActive: false };
    }
    const totalRecords: number = await CorporateModel.countDocuments({
      ...condition,
      isDeleted: false,
    });
    const result: Document[] = await CorporateModel.find({
      ...condition,
      isDeleted: false,
    })
      .sort(sort)
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    return res.status(200).json({
      responseCode: 200,
      message: messages.listFetchSuccess.replace(':item', 'Corporate'),
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
   VIEW CORPORATE DETAILS
 ---------------------------
 */

/**
 * @api {get} corporate/:id  Corporate details
 * @apiName viewCorporate
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch a Corporate details
 * @apiParam {String} id id of the Corporate.
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    message: 'Corporate details fetched successfully',
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

const viewCorporate = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;
    const { id }: string | any = params;
    const result: Document | null | any = await CorporateModel.findOne({
      _id: id,
      isDeleted: false,
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
      message: messages.viewSuccess.replace(':item', 'Corporate'),
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
     DELETE CORPORATE
 ---------------------------
 */

/**
 * @api {delete} corporate/:id   Delete Corporate
 * @apiName deleteCorporate
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To Delete a Corporate
 * @apiParam {String} _id id of the Corporate
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    responseCode: 200,
      message: 'Corporate deleted Successfully',
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

const deleteCorporate = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;

    const { id }: string | any = params;
    const result: Document | null | any = await CorporateModel.findOne({
      _id: id,
      isDeleted: false,
    });
    if (result == null) {
      return res.status(404).json({
        responseCode: 404,
        message: messages.notFound.replace(':item', 'Data'),
        success: true,
      });
    }
    await CorporateModel.updateOne(
      { _id: id },
      {
        $set: {
          isDeleted: true,
        },
      }
    );
    return res.status(200).json({
      responseCode: 200,
      message: messages.deletedSuccess.replace(':item', 'Corporate'),
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
 --------------------------------
   UPDATE CORPORATE STATUS
 --------------------------------
 */
/**
 * @api {put} /corporate/update-status/:id  Update Corporate status
 * @apiName updateStatusCorporate
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription  API for Update Corporate Status
 * @apiParam {Boolean} isActive isActive status of the Corporate.
 * @apiParam {String} id id of the Corporate.
 * @apiParamExample {Object} Request-Example:
{
  isActive: true
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:'Corporate activated successfully!',
 *   responseCode: 200,
 *   data: result,
 *  success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const updateStatusCorporate = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body, params } = req;
    const { isActive } = body;
    const { id }: string | any = params;
    const result: Document = await CorporateModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          isActive: isActive,
        },
      }
    );
    const text: string =
      isActive === true
        ? messages.activeSuccess.replace(':item', 'Corporate')
        : messages.deactivatedSuccess.replace(':item', 'Corporate');
    return res.status(200).json({
      message: text,
      success: true,
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
export {
  addCorporate,
  updateCorporate,
  getCorporateList,
  viewCorporate,
  deleteCorporate,
  updateStatusCorporate,
};
