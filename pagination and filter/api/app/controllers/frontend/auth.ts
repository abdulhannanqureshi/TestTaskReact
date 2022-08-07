import { Request, Response } from 'express';
const mailChimp: any = require('@mailchimp/mailchimp_marketing');
const TalentLMS: any = require('talentlms');
import {
  UniversityModel,
  UserModel,
  EmailTemplateModel,
  CorporateModel,
} from '../../models';
import {
  encryptPassword,
  comparePassword,
  generateSalt,
  JWTSecrete,
  ValidationFormatter,
  Email,
  encrypt,
  decrypt,
  getIpAddress,
  generateNumber,
  checkEmail,
} from '../../common';
import { sign as JWTSign } from 'jsonwebtoken';
import { Document } from 'mongoose';
import { webURL } from '../../config';
import { message } from '../../common';
const { validationResult } = require('express-validator/check');

/**
 -----------------------
       USER LOGIN
 -----------------------
 */
/**
 * @api {post} auth/login  User Login
 * @apiName User Login
 * @apiGroup Frontend
 * @apiPermission none
 * @apiDescription Login API for User
 * @apiParam {String} email Email of the User.
 * @apiParam {String} password Password of the User.
 * @apiParamExample {Object} Request-Example:
{
    "email": "jon@mail.com",
    "password": "123456"
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message: "Logged in Successfully"
 *   responseCode: 200,
 *   data: result,
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 * HTTP/1.1 404 NotFound
 * {
 *    message:'Email Address not found'
 *  responseCode: 404,
 *  success: false
 * }
 * * HTTP/1.1 400 accountDeactivated
 * {
 *    message:"Account has been deactivated by super admin.",
 *  responseCode: 400,
 *  success: false
 * }
 * * HTTP/1.1 400 PasswordNotMatch
 * {
 *    message:"Password did not match",
 *  responseCode: 400,
 *  success: false
 * }
 *    HTTP/1.1 500 Internal Server Error
 */
const login = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }

  try {
    const { body } = req;
    const { email, password } = body;
    // const { valid, reason, validators } = await checkEmail(body.email);
    // if (!valid) {
    //   return res.status(400).send({
    //     message: 'Please provide a valid email address.',
    //     code: 400,
    //     success: false,
    //   });
    // }
    const result: Document | null | any = await UserModel.findOne({
      email: {
        $regex: new RegExp(email.toLowerCase().trim(), 'i'),
      },
      role: { $in: ['Individual', 'Student', 'Corporate Employee'] },
      // isActive: true,
      isDeleted: false,
    });
    if (result == null) {
      throw {
        code: 404,
        message: message.notFound.replace(':item', 'Email Address'),
        success: false,
      };
    }
    if (!result.isActive) {
      throw {
        code: 400,
        message: message.accountDeactivated,
        success: false,
      };
    }
    if (!comparePassword(password, result.password)) {
      throw {
        code: 400,
        message: message.passwordNotMatch,
        success: false,
      };
    }
    result.set({
      loggedInIp: getIpAddress(req),
      loginToken: generateSalt(20),
    });
    const tokenData = await result.save();
    const token = JWTSign(
      {
        id: result.id,
        loginToken: tokenData.loginToken,
        email: email.toLowerCase(),
        firstName: result.firstName,
        lastName: result.lastName,
        phoneNumber: result.phoneNumber,
        // courseId: result.courseId,
      },
      JWTSecrete,
      {
        expiresIn: 86400,
      }
    );
    const users: Document = await UserModel.updateOne(
      {
        _id: result.id,
        // email: result.email,
      },
      {
        $set: {
          lastLogin: new Date(Date.now()),
        },
      }
    );

    return res.status(200).json({
      responseCode: 200,
      message: message.loggedIn,
      data: result,
      token: token,
    });
  } catch (error) {
    console.log(error);
    const code = error.code ? error.code : 500;
    res.status(code).json({
      code: code,
      message: error.message ? error.message : message.unexpectedError,
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
 * @api {get} auth/details  User details
 * @apiName userDetails
 * @apiGroup Frontend
 * @apiPermission User
 * @apiDescription To fetch profile details of User
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    message: User details fetched successfully
 *    responseCode: 200
 *    data: result
 *    success: true
 * }
 * @apiErrorExample {json} List error
 * HTTP/1.1 404 NotFound
 * {
 *    message: "User not found.",
 *  responseCode: 404,
 *  success: false
 * }
 *    HTTP/1.1 500 Internal Server Error
 */
const userDetails = async (req: Request, res: Response): Promise<any> => {
  try {
    const { currentUser } = req;
    if (currentUser) {
      console.log('currentUser', currentUser);

      const result = await UserModel.findById(currentUser.id);

      return res.status(200).json({
        responseCode: 200,
        message: message.viewSuccess.replace(':item', 'User'),
        data: result,
        success: true,
      });
    } else {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'User'),
        success: true,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message ? error.message : message.unexpectedError,
      success: false,
    });
  }
};

/**
 ---------------------------
    UPDATE USER DETAILS
 ---------------------------
 */

/**
 * @api {put} /auth/update   Update User Profile
 * @apiName userProfile
 * @apiGroup Frontend
 * @apiPermission User
 * @apiDescription update User profile details
 * @apiParam {String}  firstName firstName of the User.
 * @apiParam {String}  firstName lastName of the User.
 * @apiParam {String} email email of the User.
 * @apiParamExample {Object} Request-Example:
{
    "firstName": "jon",
    "lastName": "doe",
    "email": "jon@mail.com"
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message: "User profile updated successfully",
 *   responseCode: 200,
 *   success: true,
 *   data: result
 * }
 * @apiErrorExample {json}  error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 * HTTP/1.1 404 NotFound
 * {
 *    message:"User not found",
 *  responseCode: 404,
 *  success: false
 * }
 * * HTTP/1.1 401 Unauthorized
 * {
 *    message:'This Email Address is already registered with us. Please try to register with another Email Address.',
 *  responseCode: 401,
 *  success: false
 * }
 *    HTTP/1.1 500 Unknown Error
 * {
 *    message: "Internal Server Error"
 * }
 */
const userProfile = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { currentUser, body } = req;
    if (currentUser) {
      const users = await UserModel.find({
        email: body.email.toLowerCase(),
        isDeleted: false,
        _id: {
          $ne: currentUser.id,
        },
      });
      if (users.length > 0) {
        return res.status(401).json({
          message: message.emailExist,
          success: false,
        });
      }
      const result = await UserModel.updateOne(
        {
          _id: currentUser.id,
        },
        {
          $set: {
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email.toLowerCase(),
          },
        }
      );
      return res.status(200).json({
        responseCode: 200,
        message: message.updateSuccess.replace(':item', 'User Profile'),
        data: result,
        success: true,
      });
    } else {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'User'),
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message ? error.message : message.unexpectedError,
      success: false,
    });
  }
};

/**
 ---------------------------
      CHANGE PASSWORD
 ---------------------------
 */

/**
 * @api {put} auth/change-password  Change Password
 * @apiName userChangePassword
 * @apiGroup Frontend
 * @apiPermission User
 * @apiDescription Change Password of User
 * @apiParam {String} oldPassword Old Password of the User.
 * @apiParam {String} newPassword new Password of the User.
 * @apiParamExample {Object} Request-Example:
 * {
 *   oldPassword: "123456",
 *   newPassword: "654321"
 * }
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message: "Password updated successfully"
 *   responseCode: 200
 *   success: true
 *   data: result
 * }
 * @apiErrorExample {json} List error
 * HTTP/1.1 422 Unprocessable Entity
 * {
 *  "message": "Invalid request",
 *    success: false
 *}
 * HTTP/1.1 400 OldPasswordNotMatch
 * {
 *    message: " Old Password did not match.",
 *    success: false
 * }
 * HTTP/1.1 404  NOTFOUND
 * {
 *    message: " User not found.",
 *   success: false,
 *   responseCode: 404,
 * }
 *    HTTP/1.1 500 Unknown Error
 * {
 *    message: "Internal Server Error"
 * }
 */
const userChangePassword = async (
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
    const { body, currentUser } = req;
    const users: Document | null | any = await UserModel.findOne({
      _id: currentUser ? currentUser.id : undefined,
    });
    if (!comparePassword(body.oldPassword, users.password)) {
      throw {
        code: 400,
        message: message.passwordNotMatch.replace('Password', 'Old Password'),
        success: false,
      };
    }
    if (comparePassword(body.newPassword, users.password)) {
      throw {
        code: 400,
        message: 'Current Password can not be used as a new password',
        success: false,
      };
    }
    const salt = generateSalt();
    body.newPassword = encryptPassword(body.newPassword, salt);
    if (currentUser) {
      const result = await UserModel.updateOne(
        {
          _id: currentUser.id,
        },
        {
          $set: {
            password: body.newPassword,
            salt: salt,
          },
        }
      );
      return res.status(200).json({
        responseCode: 200,
        message: message.updateSuccess.replace(':item', 'Password'),
        data: result,
        success: true,
      });
    } else {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'User'),
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message ? error.message : message.unexpectedError,
      success: false,
    });
  }
};

/**
 -----------------------
       SIGNUP USER
 -----------------------
 */
/**
 * @api {post} user/signup  Signup User
 * @apiName signup
 * @apiGroup Frontend
 * @apiPermission none
 * @apiDescription  API for user signup
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
const signup = async (req: Request, res: Response): Promise<any> => {
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
      password,
      role,
      university,
      corporate,
      doNotSell,
    } = body;
    const { valid, reason, validators } = await checkEmail(body.email);
    if (!valid) {
      return res.status(400).send({
        message: 'Please provide a valid email address.',
        code: 400,
        success: false,
      });
    }
    const user: Document | null | any = await UserModel.findOne({
      email: {
        $regex: new RegExp(email.toLowerCase().trim(), 'i'),
      },
      // role,
      isDeleted: false,
    });
    if (user) {
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
      role,
      doNotSell,
      password: encryptedPassword,
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
    // console.log('mailchimp response', response);

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
    //       status: 'subscribed',
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
            email,
            loginLink: process.env.Live_PUBLIC_FRONTEND_ENDPOINT,
            loginButton: `<a  style="color:white;
            padding:10px;
            background-color:#3272bd;
            cursor:pointer;
            text-decoration:none" 
             href="${process.env.Live_PUBLIC_FRONTEND_ENDPOINT}/signin"
             >Click here to Login</a>`,
          }
        );
        await emailInstance.sendEmail(email);
      }
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        responseCode: 400,
        message: error.message,
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
      message: error.message ? error.message : message.unexpectedError,
      success: false,
    });
  }
};

/**
 ---------------------------
       FORGOT PASSWORD
 ---------------------------

 * @api {get} auth/forgot-password   Forgot password
 * @apiName forgotPassword
 * @apiGroup Frontend
 * @apiDescription  To recover forgot password
 * @apiPermission none
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message: 'Email sent. Please check your inbox.',
 *   data: updateToken,
 *   success: true
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 400 EmailNotFound
 * {
 *    message:'Email Address is not Registered with us. Please try to login with registered email address.',
 *    responseCode: 400,
      success: false,
 * }
 *    HTTP/1.1 500 Unknown Error
 * {
 *    message: "Unexpected error occurred"
 *    success: false,
 *
 * }
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 * }
 */

const forgotPassword = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }

  try {
    const { body } = req;
    const result: any = await UserModel.findOne({
      email: body.email.toLowerCase(),
      isDeleted: false,
      // isActive: true,
    });

    if (result === null) {
      throw {
        code: 400,
        message: message.emailNotFound,
      };
    }
    if (!result.isActive) {
      throw {
        code: 400,
        message: message.accountDeactivated,
        success: false,
      };
    }
    body.email = encrypt(result.email);
    body.id = encrypt(result._id);
    body.verifyToken = encrypt(result.email + result.id);
    console.log(body.verifyToken);

    const updateToken: Document = await UserModel.updateOne(
      {
        email: result.email.toLowerCase(),
        _id: result._id,
      },
      {
        verifyToken: body.verifyToken,
      }
    );
    try {
      // email template for registration
      const availableTemplate: any = await EmailTemplateModel.findOne({
        templateName: {
          $regex: new RegExp('forget-password'.trim(), 'i'),
        },
      });

      if (availableTemplate) {
        const upperCaseFirstName =
          `${result.firstName}`.charAt(0).toUpperCase() +
          `${result.firstName}`.slice(1);
        const upperCaseLastName =
          `${result.lastName}`.charAt(0).toUpperCase() +
          `${result.lastName}`.slice(1);
        const fullName: string = `${upperCaseFirstName} ${upperCaseLastName}`;
        const emailInstance: any = new Email(req);
        await emailInstance.setTemplate(
          availableTemplate.subject,
          availableTemplate.htmlContent,
          {
            fullName,
            verifyToken: `${process.env.Live_PUBLIC_FRONTEND_ENDPOINT}/reset-password/${body.verifyToken}`,
            forgetPasswordButton: `<a  style="color:white;
                                   padding:10px;
                                   background-color:#3272bd;
                                   cursor:pointer;
                                   text-decoration:none" 
                            href="${process.env.Live_PUBLIC_FRONTEND_ENDPOINT}/reset-password/${body.verifyToken}"
                      
                         >Reset Password</a>`,
          }
        );

        await emailInstance.sendEmail(result.email);
      }
    } catch (error) {
      return res.status(400).json({
        responseCode: 400,
        message: error.message,
      });
    }
    return res.status(200).json({
      message: message.emailSent,
      success: true,
      data: updateToken,
    });
  } catch (error) {
    const code = error.code ? error.code : 500;
    res.status(code).json({
      code: code,
      message: error.message ? error.message : message.unexpectedError,
      success: false,
    });
  }
};

/**
 ---------------------------
      LINK VERIFICATION
 ---------------------------
 */

/**
 * @api {get} auth/link-verified    User link verification
 * @apiName linkVerified
 * @apiGroup Frontend
 * @apiPermission User
 * @apiDescription To verify user by link
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    message: Link Verified successfully
 *    data: result
 *    success: true
 * }
 * @apiErrorExample {json} List error
 * HTTP/1.1 400 linkExpired
 * {
 *    message: "Your verification link has been expired.",
 *  responseCode: 400,
 *  success: false
 * }
 *    HTTP/1.1 500 Internal Server Error
 */
const linkVerified = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query } = req;
    // query.email = decrypt(query.user);
    // query.id = decrypt(query.verification);
    const result: any = await UserModel.findOne({
      // email: query.email,
      // _id: query.id,
      verifyToken: query.token,
      isDeleted: false,
    });
    if (result === null) {
      throw {
        code: 400,
        message: message.linkExpired,
        success: false,
      };
    }
    return res.status(200).json({
      message: message.verifySuccess.replace(':item', 'Link'),
      data: result,
      success: true,
    });
  } catch (error) {
    const code = error.code ? error.code : 500;
    res.status(code).json({
      code: code,
      message: error.message ? error.message : message.unexpectedError,
      success: false,
    });
  }
};

/**
 ---------------------------
       RESET PASSWORD
 ---------------------------
 */

/**
 * @api {post} /auth/reset-password  Reset password
 * @apiName resetPassword
 * @apiGroup Frontend
 * @apiPermission User
 * @apiDescription Reset password through jwt token verification
 * @apiParam {String}  email email of the User.
 * @apiParam {String}  password new password of the User.
 * @apiParam {String}  verifytoken token of the User.
 * @apiParam {String}  id id of the User.
 *
 * @apiParamExample {Object} Request-Example:
 * {
 *   _id: "5fe580d74fb38f2b81d60ab2",
 *   email: "test@yahoo.com",
 * password: "123456",
 *   verifytoken : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

 * }
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message: "Password changed successfully."
 *   responseCode: 200
 *   success: true
 *    data: result
 *
 * }
 * @apiErrorExample {json}  error list
*  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 * }
 *    HTTP/1.1 500 Unknown Error
 * {
 *    message: "Unexpected error occurred"
 * }
 *
 */

const resetPassword = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { body } = req;
    // const email: string = body.email;
    // const id: string = body._id;
    const verifyToken: string = body.verifyToken;
    var salt = generateSalt(6);
    body.salt = salt;
    body.password = encryptPassword(body.password, salt);

    const checkUser: any = await UserModel.findOne({
      verifyToken: verifyToken,
    });
    if (checkUser === null) {
      throw {
        code: 400,
        message: 'Token expired',
        success: false,
      };
    }

    const result: Document = await UserModel.updateOne(
      {
        // _id: id,
        // email: email,
        verifyToken: verifyToken,
      },
      {
        $set: {
          password: body.password,
          // salt: body.salt,
          verifyToken: '',
        },
      },
      {
        new: true,
      }
    );
    return res.status(200).json({
      responseCode: 200,
      data: result,
      message: message.passwordChanged,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message ? error.message : message.unexpectedError,
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
 * @api {get} auth/universities  Get Universities list
 * @apiName getUniversities
 * @apiGroup Frontend
 * @apiPermission user
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
       * @api {get} auth/corporation  Get Corporation list
       * @apiName getCorporate
       * @apiGroup Frontend
       * @apiPermission user
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
export {
  login,
  userDetails,
  userProfile,
  userChangePassword,
  signup,
  forgotPassword,
  linkVerified,
  resetPassword,
  getCorporate,
  getUniversities,
};
