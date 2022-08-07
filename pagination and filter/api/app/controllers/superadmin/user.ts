import { Request, Response } from 'express';
import * as fastCsv from 'fast-csv';
import fs from 'fs';
import path from 'path';
const mailChimp: any = require('@mailchimp/mailchimp_marketing');
const TalentLMS: any = require('talentlms');
// import TalentLMS from 'talentlms';
import {
  UserModel,
  EmailTemplateModel,
  UniversityModel,
  CorporateModel,
} from '../../models';
import {
  encryptPassword,
  generateSalt,
  generateNumber,
  message,
} from '../../common';
import { Document, Types } from 'mongoose';
import moment from 'moment';
import { validationResult } from 'express-validator';
import { ValidationFormatter } from '../../common/formatter';
import { Email, checkEmail } from '../../common';
import Mongoose from 'mongoose';

/**
 -----------------------
       ADD USER 
 -----------------------
 */
/**
 * @api {post} user/  Add User
 * @apiName addUser
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Add API for user
 * @apiParam {String} email Email of the User.
 * @apiParam {String} firstName firstName of the User.
 * @apiParam {String} lastName lastName of the User.
 * @apiParam {String} password Password of the User.
 * @apiParamExample {Object} Request-Example:
{
   "firstName": "chandu",
    "lastName": "shah",
    "email": "chandu@mailinator.com",
    "password": "123456"
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:'User added successfully.',
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
 *    message:'This Email Address is already regisred with us. Please try to register with another Email Address.',
 *  responseCode: 400,
 *  success: false
 * }
 *    HTTP/1.1 500 Internal Server Error
 */
const addUser = async (req: Request, res: Response): Promise<any> => {
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
      firstName,
      lastName,
      email,
      role,
      university,
      corporate,
      password,
    } = body;

    const { valid, reason, validators } = await checkEmail(email);
    if (!valid) {
      return res.status(400).send({
        message: 'Please provide a valid email address.',
        code: 400,
        success: false,
      });
    }
    const users: Document | null | any = await UserModel.findOne({
      email: {
        $regex: new RegExp(email.trim(), 'i'),
      },
      role,
      isDeleted: false,
    });
    if (users) {
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
      password: encryptedPassword,
      role,
      university: role === 'Student' ? university : '',
      corporate: role === 'Corporate Employee' ? corporate : '',
    };
    const userData: Document = new UserModel(data);

    const result: any = await userData.save();
    try {
      let tlmsUserRole: any;
      const talentLMS = new TalentLMS(
        process.env.TALENTLMSURL,
        process.env.TALENTLMSAPIKEY
      );

      const checkUserInTlms: Document | any =
        await talentLMS.Users.getUserByEmail(email);
      if (checkUserInTlms.id && checkUserInTlms.id.length) {
        await UserModel.updateOne(
          {
            _id: result._id,
          },
          {
            $set: {
              talentLmsUserId: checkUserInTlms.id,
            },
          }
        );
      } else {
        switch (role) {
          case 'Individual':
            tlmsUserRole = 'Learner-Type';
            break;
          case 'Student':
            //  tlmsUserRole = 'Trainer-Type';
            tlmsUserRole = 'Learner-Type';
            break;
          case 'Corporate Employee':
            tlmsUserRole = 'Learner-Type';
            //  tlmsUserRole = 'Admin-Type';
            break;
          default:
            break;
        }
        let login: any = `${firstName}${generateNumber()}`;

        const obj: any = {
          first_name: firstName,
          last_name: lastName,
          email,
          user_type: tlmsUserRole,
          login,
          password,
        };

        const addUserInTlms: Document | any = await talentLMS.Users.userSignup(
          obj
        );

        if (addUserInTlms) {
          await UserModel.updateOne(
            {
              _id: result._id,
            },
            {
              $set: {
                talentLmsUserId: addUserInTlms.id,
              },
            }
          );
        }
      }
    } catch (error) {
      console.log('tlmserror', error);
    }
    // mailChimp.setConfig({
    //   apiKey: process.env.MAILCHIMP_KEY,
    //   server: process.env.MAILCHIMP_SERVER,
    // });
    // const response: any = await mailChimp.lists.getAllLists();
    // let listId: any = [];
    // if (response) {
    //   for (const iterator of response.lists) {
    //     await listId.push(iterator.id.toString());
    //   }
    // } //end of
    // try {
    //   const mailChimpUser: any = await mailChimp.lists.addListMember(
    //     listId[0],
    //     {
    //       email_address: email,
    //       status: 'pending',
    //       email_type: 'html',
    //       merge_fields: {
    //         FNAME: firstName,
    //         LNAME: lastName,
    //       },
    //     }
    //   );
    //   console.log('mailChimpUser', mailChimpUser);
    // } catch (err) {
    //   console.log(err);
    // }

    try {
      // email template for registration
      const availableTemplate: any = await EmailTemplateModel.findOne({
        templateName: {
          $regex: new RegExp('registration'.trim(), 'i'),
        },
      });

      if (availableTemplate) {
        const upperCaseFirstName =
          `${firstName}`.charAt(0).toUpperCase() + `${firstName}`.slice(1);
        const upperCaseLastName =
          `${lastName}`.charAt(0).toUpperCase() + `${lastName}`.slice(1);
        const fullName: string = `${upperCaseFirstName} ${upperCaseLastName}`;
        const emailInstance: any = new Email(req);
        await emailInstance.setTemplate(
          availableTemplate.subject,
          availableTemplate.htmlContent,
          {
            fullName,
            password,
            email: email.toLowerCase(),
            loginLink: process.env.Live_PUBLIC_FRONTEND_ENDPOINT,
          }
        );
        await emailInstance.sendEmail(email);
      }
    } catch (error) {
      return res.status(400).json({
        responseCode: 400,
        message: message.emailNotWorking.replace(':item', 'User'), //error.message
      });
    }

    return res.status(200).json({
      message: message.addedSuccess.replace(':item', 'User'),
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
      GET ALL USERS
 -------------------------
 */

/**
 * @api {get} user/  Get user list
 * @apiName getUsers
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch users details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  message: "User list fetched successfully"
 *   responseCode: 200,
      data: result,
      totalRecords,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const getUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query } = req;
    const searchValue: any = query.searchValue || '';
    const isActive: any = query.isActive || '';
    let skip: any = query.skip || 0;
    let limit: any = query.limit || 10;
    const sortBy: any = query.sortBy || '';
    // const fromDate: any = query.fromDate || '';
    // const toDate: any = query.toDate || '';
    // const role: any = query.role || 'Individual';
    let condition: object = {
      role: { $in: ['Individual', 'Student', 'Corporate Employee'] },
    };
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
          {
            role: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
        ],
      };
    }
    // let dateCondition = {};
    // if (fromDate != null && toDate != null) {
    //   dateCondition = {
    //     $gte: moment.utc(fromDate).startOf('day').toDate(),
    //     $lte: moment.utc(toDate).endOf('day').toDate(),
    //   };
    // }
    // if (fromDate != 'null' && toDate != 'null') {
    //   condition = {
    //     ...condition,
    //     createdAt: {
    //       $gte: moment.utc(fromDate).startOf('day').toDate(),
    //       $lte: moment.utc(toDate).endOf('day').toDate(),
    //     },
    //   };
    // }
    if (isActive === 'true') {
      condition = { ...condition, isActive: true };
    }
    if (isActive === 'false') {
      condition = { ...condition, isActive: false };
    }
    const totalRecords: number = await UserModel.countDocuments({
      ...condition,
      isDeleted: false,
    });
    const result: Document[] = await UserModel.find({
      ...condition,
      isDeleted: false,
    })
      .sort(sort)
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    return res.status(200).json({
      message: message.listFetchSuccess.replace(':item', 'User'),
      responseCode: 200,
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
          : message.unexpectedError,
      success: false,
    });
  }
};

/**
 ---------------------------
      VIEW USER DETAILS
 ---------------------------
 */

/**
 * @api {get} user/:id  User details
 * @apiName User details
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch User profile details
 * @apiParam {String} _id id of the User.
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    message: "User details fetched successfully"
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

const viewUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;

    const { id }: string | any = params;
    const result: Document | null | any = await UserModel.findOne({
      _id: id,
      role: { $ne: 'Superadmin' },
      isDeleted: false,
    });
    if (result === null) {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'User'),
        success: true,
      });
    }
    return res.status(200).json({
      message: message.viewSuccess.replace(':item', 'User'),
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
       UPDATE USER 
 -----------------------
 */
/**
 * @api {put} user/:id  Update User
 * @apiName updateUser
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Update API for user
 * @apiParam {String} email Email of the User.
 * @apiParam {String} firstName firstName of the User.
 * @apiParam {String} lastName lastName of the User.
 * @apiParamExample {Object} Request-Example:
{
   "firstName": "jon",
    "lastName": "snow",
    "email": "jon@mailinator.com",
  
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:'User details updated successfully.',
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

const updateUser = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { body, params } = req;
    const { valid, reason, validators } = await checkEmail(body.email);
    if (!valid) {
      return res.status(400).send({
        message: 'Please provide a valid email address.',
        code: 400,
        success: false,
      });
    }
    const { id }: string | any = params;
    /* if (body.password) {
      var salt: string = generateSalt(6);
      body.salt = salt;
      body.password = encryptPassword(body.password, salt);
    } else {
      delete body.password;
    } */
    if (body.password) {
      delete body.password;
    }
    const currentUser: any = await UserModel.findOne({
      _id: id,
    });
    const user: Document[] = await UserModel.find({
      email: body.email.toLowerCase(),
      isDeleted: false,
      _id: { $ne: id },
    });
    if (user.length > 0) {
      return res.status(400).json({
        message: message.emailExist,
        success: false,
      });
    }

    const result: Document = await UserModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          ...body,
        },
      }
    );
    if (currentUser.email != body.email) {
      let password: any = '123456789';
      const talentLMS = new TalentLMS(
        process.env.TALENTLMSURL,
        process.env.TALENTLMSAPIKEY
      );
      const obj: any = {
        user_id: currentUser.talentLmsUserId,
        email: body.email,
        password: password,
      };

      const updateUserInTlms: Document | any = await talentLMS.Users.editUser(
        obj
      );
      console.log('updateUserInTlms', updateUserInTlms);

      const availableTemplate: any = await EmailTemplateModel.findOne({
        templateName: {
          $regex: new RegExp('email-change'.trim(), 'i'),
        },
      });

      if (availableTemplate) {
        const upperCaseFirstName =
          `${currentUser.firstName}`.charAt(0).toUpperCase() +
          `${currentUser.firstName}`.slice(1);
        const upperCaseLastName =
          `${currentUser.lastName}`.charAt(0).toUpperCase() +
          `${currentUser.lastName}`.slice(1);
        const fullName: string = `${upperCaseFirstName} ${upperCaseLastName}`;
        const emailInstance: any = new Email(req);
        await emailInstance.setTemplate(
          availableTemplate.subject,
          availableTemplate.htmlContent,
          {
            fullName,
            newEmail: body.email,
            oldEmail: currentUser.email,
            password,
            loginLink: process.env.Live_PUBLIC_FRONTEND_ENDPOINT,
            loginLinkForTalentlms:
              'https://coinifideacademy.talentlms.com/index',
            coinfiedLoginButton: `<a  style="color:white;
              padding:10px;
              background-color:#3272bd;
              cursor:pointer;
              text-decoration:none" 
              href=${process.env.Live_PUBLIC_FRONTEND_ENDPOINT}/signin
               >Login Coinifide</a>`,
            talentLmsLoginButton: `<a  style="color:white;
              padding:10px;
              background-color:#3272bd;
              cursor:pointer;
              text-decoration:none" 
               href= "https://coinifideacademy.talentlms.com/index"
               >Login Talentlms</a>`,
          }
        );
        await emailInstance.sendEmail(body.email);
      }
    }
    return res.status(200).json({
      responseCode: 200,
      data: result,
      message: message.updateSuccess.replace(':item', 'User details'),
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
    UPDATE USER STATUS
 -----------------------
 */
/**
 * @api {put} /user/update-status/:id  Update User status
 * @apiName updateStatus
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription  API for Update user Status
 * @apiParam {Boolean} isActive isActive status of the User.
 * @apiParam {String} id id of the User.
 * @apiParamExample {Object} Request-Example:
{
  isActive: true
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:'User activated successfully!',
 *   responseCode: 200,
 *   data: result,
 *  success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const updateAdminStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body, params } = req;
    const { isActive } = body;
    const { id }: string | any = params;
    const result: Document = await UserModel.updateOne(
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
        DELETE USER 
 ---------------------------
 */

/**
 * @api {delete} user/:id     Delete User 
 * @apiName deleteUser
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To Delete User profile 
 * @apiParam {String} _id id of the User.
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    responseCode: 200,
      message: 'User deleted',
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

const deleteUser = async (req: Request, res: Response): Promise<any> => {
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
      message: message.deletedSuccess.replace(':item', 'User'),
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
    GET ALL UNIVERSITY
 -------------------------
 */

/**
 * @api {get} user/universities  Get Universities list
 * @apiName getUniversities
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch Universities details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  message: "Universities list fetched successfully"
 *   responseCode: 200,
      data: result,
      totalRecords,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const getUniversities = async (req: Request, res: Response): Promise<any> => {
  try {
    // const sort: any = { createdAt: -1 };

    const result: Document[] = await UniversityModel.find(
      { isDeleted: false, isActive: true },
      { _id: 1, name: 1 }
    ).sort({ name: 1 });

    return res.status(200).json({
      message: message.listFetchSuccess.replace(':item', 'Universities'),
      success: true,
      responseCode: 200,
      data: result,
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
 -------------------------
    GET ALL CORPORATE
 -------------------------
 */

/**
 * @api {get} user/corporation  Get Corporation list
 * @apiName getCorporate
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch Corporate details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  message: "Corporate list fetched successfully"
 *   responseCode: 200,
      data: result,
      totalRecords,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const getCorporate = async (req: Request, res: Response): Promise<any> => {
  try {
    // const sort: any = { createdAt: -1 };

    const result: Document[] = await CorporateModel.find(
      { isDeleted: false, isActive: true },
      { _id: 1, name: 1 }
    ).sort({ name: 1 });

    return res.status(200).json({
      message: message.listFetchSuccess.replace(':item', 'Corporate'),
      success: true,
      responseCode: 200,
      data: result,
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
 -------------------------
     EXPORT USER CSV
 -------------------------
 */

/**
 * @api {get} user/user-csv  Get csv file of user
 * @apiName exportsUserCsv
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To Download csv file of User
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const exportsUserCsv = async (req: Request, res: Response): Promise<any> => {
  try {
    const fileName: any = `user_${Date.now()}.csv`;
    // const wsPath: any = path.join(
    //   __dirname,
    //   '..',
    //   `app/public/uploads/csv/${fileName}`
    // );
    const ws: any = fs.createWriteStream(
      path.join(path.dirname(__dirname), `app/public/uploads/csv/${fileName}`)
    );
    const users: Document[] | any = await UserModel.find(
      { role: { $in: ['Individual', 'Student', 'Corporate Employee'] } },
      {
        _id: 0,
        // name: {
        //   $concat: [
        //     { $ifNull: ['$firstName', ''] },
        //     ' ',
        //     { $ifNull: ['$lastName', ''] },
        //   ],
        // },

        email: 1,
        firstName: 1,
        lastName: 1,
        talentLmsUserId: 1,
        university: 1,
        corporate: 1,
        //role: 1,
        isDeleted: 1,
        isActive: 1,
        createdAt: 1,
      }
    )
      .sort({ _id: -1 })
      .lean();
    console.log(users);

    await fastCsv
      .write(users, { headers: true })
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
    USER BULK ACTION
 -------------------------------
 */

/**
 * @api {post} user/bulk-action      User Bulk Action
 * @apiName userBulkAction
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To Perform bulk action on User
 * @apiParam {String} ids id of the User.
 * @apiParam {String} type type of action.
 * @apiParamExample {Object} Request-Example:
   {
  ids: ["612df7b67316b6623761c0e4",'612df7b67316b6623761c0e8],
  type:'Delete',

    }
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message:"User deleted successfully",
 *   responseCode: 200,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const userBulkAction = async (req: Request, res: Response): Promise<any> => {
  try {
    const { ids, type } = req.body;
    let updateData: any = {};
    let msg = '';
    if (type === 'Delete') {
      msg = 'User deleted successfully';
      updateData.isDeleted = true;
    }
    if (type === 'Active') {
      msg = 'User activated successfully';
      updateData.isActive = true;
    }
    if (type === 'Deactive') {
      msg = 'User deactivated successfully';
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
  addUser,
  getUsers,
  viewUser,
  updateUser,
  updateAdminStatus,
  deleteUser,
  getUniversities,
  getCorporate,
  userBulkAction,
  exportsUserCsv,
};
// const removeUserToCourse: Document | any =
//   await talentLMS.Courses.removeUserFromCourse('46', '3');
