import { Request, Response } from 'express';
import * as fastCsv from 'fast-csv';
import fs from 'fs';
import path from 'path';

import { UserModel, EmailTemplateModel } from '../../models';
import {
  encryptPassword,
  generateSalt,
  generateNumber,
  message,
  Email,
} from '../../common';
import { Document, Types } from 'mongoose';
import moment from 'moment';
import { validationResult } from 'express-validator';
import { ValidationFormatter } from '../../common/formatter';

import Mongoose from 'mongoose';

/**
 -----------------------
       ADD ADMIN 
 -----------------------
 */
/**
 * @api {post} admin/  Add Admin
 * @apiName addAdmin
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Add API for admin
 * @apiParam {String} email Email of the Admin.
 * @apiParam {String} firstName firstName of the Admin.
 * @apiParam {String} lastName lastName of the Admin.
 * @apiParam {String} password Password of the Admin.
 * @apiParam {String} rolesPermission Permissions of the Admin.
 * @apiParamExample {Object} Request-Example:
{
   "firstName": "jon",
    "lastName": "snow",
    "email": "jon@mailinator.com",
    "password":'12345678',
    "rolesPermission":['viewUser', 'editUser',viewCourse, editCourse],
     
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:'Admin added successfully.',
 *   responseCode: 200,
 *   data: result,
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 *  HTTP/1.1 400 emailExist
 * {
 *    message:'This Email Address is already registered with us. Please try to register with another Email Address.',
 *  responseCode: 400,
 *  success: false
 * }
 *    HTTP/1.1 500 Internal Server Error
 */
const addAdmin = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { body, currentUser = { id: '' } } = req;
    const { firstName, lastName, roleName, email, rolesPermission, password } =
      body;
    const admins: Document | null | any = await UserModel.findOne({
      email: {
        $regex: new RegExp(email.toLowerCase().trim(), 'i'),
      },
      role: { $in: ['Superadmin', 'Admin'] },
      isDeleted: false,
    });
    // createdBy
    if (admins) {
      return res.status(400).json({
        code: 400,
        message: message.emailExist,
        success: false,
      });
    }

    const salt: string = generateSalt(10);
    const encryptedPassword: string = encryptPassword(password, salt);
    const data: object = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      role: 'Admin',
      rolesPermission,
      roleName,
      password: encryptedPassword,
      createdBy: currentUser.id,
    };
    const adminData: Document = new UserModel(data);

    const result: any = await adminData.save();

    try {
      // email template for registration
      const availableTemplate: any = await EmailTemplateModel.findOne({
        templateName: {
          $regex: new RegExp('registration'.trim(), 'i'),
        },
      });

      if (availableTemplate) {
        const fullName: string = `${firstName} ${lastName}`;
        const emailInstance: any = new Email(req);
        await emailInstance.setTemplate(
          availableTemplate.subject,
          availableTemplate.htmlContent,
          {
            fullName,
            password,
            email,
            loginLink: process.env.Live_PUBLIC_SUPERADMIN_ENDPOINT,
          }
        );
        await emailInstance.sendEmail(email);
      }
    } catch (error) {
      return res.status(201).json({
        responseCode: 201,
        message: message.emailNotWorking.replace(':item', 'Admin'), //error.message
      });
    }

    return res.status(200).json({
      message: message.addedSuccess.replace(':item', 'Admin'),
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
      GET ALL ADMINS
 -------------------------
 */

/**
 * @api {get} admin/  Get admin list
 * @apiName getAdmins
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch admins details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  message: "Admin list fetched successfully"
 *   responseCode: 200,
      data: result,
      totalRecords,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const getAdmins = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query } = req;
    const searchValue: any = query.searchValue || '';
    const isActive: any = query.isActive || '';
    let skip: any = query.skip || 1;
    let limit: any = query.limit || 10;
    const sortBy: any = query.sortBy || '';
    const fromDate: any = query.fromDate || '';
    const toDate: any = query.toDate || '';
    // const role: any = query.role || 'Individual';
    let condition: object = { role: 'Admin', isDeleted: false };
    let sort: any = { createdAt: -1 };
    skip = (skip - 1) * limit;

    if (limit === 'all') {
      limit = '0';
    }
    if (searchValue) {
      condition = {
        ...condition,
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
    // const totalRecords: number = await UserModel.countDocuments({
    //   ...condition,
    //   isDeleted: false,
    // });
    // const result: Document[] = await UserModel.find({
    //   ...condition,
    //   isDeleted: false,
    // })
    //   .sort(sort)
    //   .skip(parseInt(skip))
    //   .limit(parseInt(limit));
    const result = await UserModel.aggregate([
      {
        $lookup: {
          from: 'users',
          as: 'user',
          foreignField: '_id',
          localField: 'createdBy',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          createdBy: {
            $concat: [
              { $ifNull: ['$user.firstName', ''] },
              ' ',
              { $ifNull: ['$user.lastName', ''] },
            ],
          },
        },
      },
      {
        $match: condition,
      },
      {
        $project: {
          _id: 1,
          isActive: 1,
          doNotSell: 1,
          isDeleted: 1,
          createdBy: 1,
          rolesPermission: 1,
          role: 1,
          email: 1,
          roleName: 1,
          firstName: 1,
          lastName: 1,
        },
      },
      { $sort: sort },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
    ]);
    const totalRecords = await UserModel.aggregate([
      {
        $lookup: {
          from: 'users',
          as: 'user',
          foreignField: '_id',
          localField: 'createdBy',
        },
      },
      {
        $unwind: {
          path: '$user',
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
      message: message.listFetchSuccess.replace(':item', 'Admin'),
      success: true,
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
 ---------------------------
      VIEW ADMIN DETAILS
 ---------------------------
 */

/**
 * @api {get} admin/:id  Admin details
 * @apiName Admin details
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch Admin profile details
 * @apiParam {String} _id id of the Admin.
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    message: "Admin details fetched successfully"
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

const viewAdmin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;

    const { id }: string | any = params;
    const result = await UserModel.aggregate([
      {
        $lookup: {
          from: 'users',
          as: 'user',
          foreignField: '_id',
          localField: 'createdBy',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          createdBy: {
            $concat: [
              { $ifNull: ['$user.firstName', ''] },
              ' ',
              { $ifNull: ['$user.lastName', ''] },
            ],
          },
        },
      },
      {
        $match: { _id: Types.ObjectId(id) },
      },
      {
        $project: {
          _id: 1,
          isActive: 1,
          doNotSell: 1,
          isDeleted: 1,
          createdBy: 1,
          roleName: 1,
          rolesPermission: 1,
          role: 1,
          email: 1,
          firstName: 1,
          lastName: 1,
        },
      },
    ]);
    if (result.length < 1) {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'Admin'),
        success: true,
      });
    }
    return res.status(200).json({
      message: message.viewSuccess.replace(':item', 'Admin'),
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
       UPDATE ADMIN 
 -----------------------
 */
/**
 * @api {put} admin/:id  Update Admin
 * @apiName updateAdmin
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Update API for admin
 * @apiParam {String} email Email of the Admin.
 * @apiParam {String} firstName firstName of the Admin.
 * @apiParam {String} lastName lastName of the Admin.
 * @apiParam {String} rolesPermission Permissions of the Admin.
 * @apiParamExample {Object} Request-Example:
{
   "firstName": "jon",
    "lastName": "snow",
    "email": "jon@mailinator.com",
    rolesPermission:['viewUser', 'editUser'],
  
  
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:'Admin details updated successfully.',
 *   responseCode: 200,
 *   data: result,
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 *  HTTP/1.1 400 emailExist
 * {
 *    message:'Email address already exist',
 *  success: false
 * }
 *    HTTP/1.1 500 Internal Server Error
 */

const updateAdmin = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { body, params } = req;
    const { firstName, roleName, lastName, rolesPermission } = body;

    const { id }: string | any = params;

    if (body.password) {
      delete body.password;
    }
    // const admin: Document[] = await UserModel.find({
    //   email: email,
    //   isDeleted: false,
    //   _id: { $ne: id },
    // });
    // if (admin.length > 0) {
    //   return res.status(400).json({
    //     message: message.emailExist,
    //     success: false,
    //   });
    // }

    const result: Document = await UserModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          firstName,
          lastName,
          roleName,
          rolesPermission,
        },
      },
      { runValidators: true }
    );

    return res.status(200).json({
      responseCode: 200,
      data: result,
      message: message.updateSuccess.replace(':item', 'Admin details'),
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
    UPDATE ADMIN STATUS
 -----------------------
 */
/**
 * @api {put} /admin/update-status/:id  Update Admin status
 * @apiName updateStatus
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription  API for Update admin Status
 * @apiParam {Boolean} isActive isActive status of the Admin.
 * @apiParam {String} id id of the Admin.
 * @apiParamExample {Object} Request-Example:
{
  isActive: true
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:'Admin activated successfully!',
 *   responseCode: 200,
 *   data: result,
 *  success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const updateStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body, params } = req;
    const { isActive } = body;
    const { id }: string | any = params;
    const result: Document = await UserModel.updateOne(
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
        ? message.activeSuccess.replace(':item', 'User')
        : message.deactivatedSuccess.replace(':item', 'User');
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
        DELETE ADMIN 
 ---------------------------
 */

/**
 * @api {delete} admin/:id     Delete Admin 
 * @apiName deleteAdmin
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To Delete Admin profile 
 * @apiParam {String} _id id of the Admin.
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    responseCode: 200,
      message: 'Admin deleted',
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

const deleteAdmin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;

    const { id }: string | any = params;
    const result: Document | null | any = await UserModel.findOne({
      _id: id,
    });
    if (result == null) {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'Data'),
        success: true,
      });
    }
    await UserModel.updateOne(
      { _id: id },
      {
        $set: {
          isDeleted: true,
        },
      }
    );
    return res.status(200).json({
      responseCode: 200,
      message: message.deletedSuccess.replace(':item', 'Admin'),
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
 -------------------------
     EXPORT ADMIN CSV
 -------------------------
 */

/**
 * @api {get} admin/admin-csv  Get csv file of admin
 * @apiName exportsAdminCsv
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To Download csv file of Admin
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const exportsAdminCsv = async (req: Request, res: Response): Promise<any> => {
  try {
    const fileName: any = `admin_${Date.now()}.csv`;
    // const wsPath: any = path.join(
    //   __dirname,
    //   '..',
    //   `app/public/uploads/csv/${fileName}`
    // );
    const ws: any = fs.createWriteStream(
      path.join(path.dirname(__dirname), `app/public/uploads/csv/${fileName}`)
    );
    const admins: Document[] | any = await UserModel.find(
      { role: 'Admin' },

      {
        //   name: {
        //     $concat: [
        //       { $ifNull: ['$firstName', ''] },
        //       ' ',
        //       { $ifNull: ['$lastName', ''] },
        //     ],
        //   },
        firstName: 1,
        lastName: 1,
        email: 1,
        roleName: 1,
        isDeleted: 1,
        isActive: 1,
        createdAt: 1,
        _id: 0,
      }
    )
      .sort({ _id: -1 })
      .lean();

    await fastCsv
      .write(admins, { headers: true })
      .on('finish', function () {
        console.log('Write to csv successfully!');
      })
      .pipe(ws);

    setTimeout(() => {
      //  const downloadPath: any = `app/public/uploads/csv/${fileName}`;
      const downloadPath: any = path.join(
        path.dirname(__dirname),
        `app/public/uploads/csv/${fileName}`
      );

      return res.download(downloadPath, (err) => {
        if (err) {
          return res.status(400).json({
            message: message.downloadFailed,
            success: false,
            responseCode: 400,
          });
        }
      });
    }, 1500);
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
 -------------------------------
    ADMIN BULK ACTION
 -------------------------------
 */

/**
 * @api {post} admin/bulk-action      Admin Bulk Action
 * @apiName adminBulkAction
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To Perform bulk action on Admin
 * @apiParam {String} ids id of the Admin.
 * @apiParam {String} type type of action.
 * @apiParamExample {Object} Request-Example:
   {
  ids: ["612df7b67316b6623761c0e4",'612df7b67316b6623761c0e8],
  type:'Delete',

    }
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message:"Admin deleted successfully",
 *   responseCode: 200,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const adminBulkAction = async (req: Request, res: Response): Promise<any> => {
  try {
    const { ids, type } = req.body;
    let updateData: any = {};
    let msg = '';
    if (type === 'Delete') {
      msg = 'Admin deleted successfully';
      updateData.isDeleted = true;
    }
    if (type === 'Active') {
      msg = 'Admin activated successfully';
      updateData.isActive = true;
    }
    if (type === 'Deactive') {
      msg = 'Admin deactivated successfully';
      updateData.isActive = false;
    }

    await UserModel.updateMany(
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
  addAdmin,
  getAdmins,
  viewAdmin,
  updateAdmin,
  updateStatus,
  deleteAdmin,
  adminBulkAction,
  exportsAdminCsv,
};
