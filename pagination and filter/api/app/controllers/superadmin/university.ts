import { Request, Response } from 'express';
import { UniversityModel } from '../../models';
import moment from 'moment';
import { Document, Types } from 'mongoose';
import { validationResult } from 'express-validator';
import { ValidationFormatter } from '../../common/formatter';
import { message as messages } from '../../common';

/**
 -----------------------
      ADD UNIVERSITY
 -----------------------
 */
/**
 * @api {post} university/  Add University
 * @apiName addUniversity
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Add API for University
 * @apiParam {String} name contactNumber of the University.
 * @apiParamExample {Object} Request-Example:
{
     "name": "oxford university",
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *    responseCode: 200,
      data: result,
      message: 'University added successfully.',
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 *    HTTP/1.1 500 Internal Server Error
 */
const addUniversity = async (req: Request, res: Response): Promise<any> => {
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
    const nameExist: Document | null | any = await UniversityModel.findOne({
      name: {
        $regex: new RegExp(name.trim(), 'i'),
      },
      isDeleted: false,
    });
    if (nameExist) {
      return res.status(400).json({
        code: 400,
        message: messages.alreadyExists.replace(':item', 'University Name'),
        success: false,
      });
    }
    const data: object = {
      name,
    };
    const universityData: Document = new UniversityModel(data);
    const result: any = await universityData.save();

    return res.status(200).json({
      message: messages.addedSuccess.replace(':item', 'University'),
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
      GET ALL UNIVERSITY
 -------------------------
 */

/**
 * @api {get} university/  Get University list
 * @apiName getUniversityList
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch University details 
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

const getUniversityList = async (req: Request, res: Response): Promise<any> => {
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
    const totalRecords: number = await UniversityModel.countDocuments({
      ...condition,
      isDeleted: false,
    });
    const result: Document[] = await UniversityModel.find({
      ...condition,
      isDeleted: false,
    })
      .sort(sort)
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    return res.status(200).json({
      responseCode: 200,
      message: messages.listFetchSuccess.replace(':item', 'University'),
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
   VIEW UNIVERSITY DETAILS
 ---------------------------
 */

/**
 * @api {get} university/:id  University details
 * @apiName viewUniversity
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch University details
 * @apiParam {String} id id of the University.
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

const viewUniversity = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;
    const { id }: string | any = params;
    const result: Document | null | any = await UniversityModel.findOne({
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
      message: messages.viewSuccess.replace(':item', 'University'),
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
 -----------------------
      ADD University
 -----------------------
 */
/**
 * @api {put} University/:id  Update University
 * @apiName updateUniversity
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Update API for University
 * @apiParam {String} name name of the University.
 * @apiParamExample {Object} Request-Example:
{
     "name": "oxford university",
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *    responseCode: 200,
      data: result,
      message: 'University updated successfully.',
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 *    HTTP/1.1 500 Internal Server Error
 */
const updateUniversity = async (req: Request, res: Response): Promise<any> => {
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
    const result: Document | null | any = await UniversityModel.findOne({
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
    const data: Document | null | any = await UniversityModel.updateOne(
      { _id: id },
      {
        $set: {
          name,
        },
      }
    );

    return res.status(200).json({
      responseCode: 200,
      message: messages.updateSuccess.replace(':item', 'University'),
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
 ---------------------------
    DELETE UNIVERSITY
 ---------------------------
 */

/**
 * @api {delete} university/:id   Delete University
 * @apiName deleteUniversity
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Api To Delete a University
 * @apiParam {String} _id id of the University
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    responseCode: 200,
      message: 'University deleted successfully',
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

const deleteUniversity = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;

    const { id }: string | any = params;
    const result: Document | null | any = await UniversityModel.findOne({
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
    await UniversityModel.updateOne(
      { _id: id },
      {
        $set: {
          isDeleted: true,
        },
      }
    );
    return res.status(200).json({
      responseCode: 200,
      message: messages.deletedSuccess.replace(':item', 'University'),
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
   UPDATE UNIVERSITY STATUS
 --------------------------------
 */
/**
 * @api {put} /university/update-status/:id  Update University status
 * @apiName updateStatusUniversity
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription  API for Update University Status
 * @apiParam {Boolean} isActive isActive status of the University.
 * @apiParam {String} id id of the University.
 * @apiParamExample {Object} Request-Example:
{
  isActive: true
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:'University activated successfully!',
 *   responseCode: 200,
 *   data: result,
 *  success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const updateStatusUniversity = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body, params } = req;
    const { isActive } = body;
    const { id }: string | any = params;
    const result: Document = await UniversityModel.updateOne(
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
        ? messages.activeSuccess.replace(':item', 'University')
        : messages.deactivatedSuccess.replace(':item', 'University');
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
  addUniversity,
  updateUniversity,
  getUniversityList,
  viewUniversity,
  deleteUniversity,
  updateStatusUniversity,
};
