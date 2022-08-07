import { Request, Response } from 'express';
import { UserModel, AdminModel, EmailTemplateModel } from '../../models';
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
  message,
} from '../../common';
import { sign as JWTSign } from 'jsonwebtoken';
import { Document } from 'mongoose';
import { webURL } from '../../config';

const { validationResult } = require('express-validator/check');
/**
 -----------------------
       ADMIN LOGIN
 -----------------------
 */
/**
 * @api {post} auth/login  Admin Login
 * @apiName Admin Login
 * @apiGroup Superadmin
 * @apiPermission none
 * @apiDescription Login API for admin
 * @apiParam {String} email Email of the Admin.
 * @apiParam {String} password Password of the Admin.
 * @apiParamExample {Object} Request-Example:
{
    "email": "superadmin@coinfied.com",
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
 *    message:'Email Address is not Registered with us. Please try to login with registered email address.'
 *  responseCode: 404,
 *  success: false
 * }
 * * HTTP/1.1 400 NotFound
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
    const result: Document | null | any = await UserModel.findOne({
      email: {
        $regex: new RegExp(email.toLowerCase().trim(), 'i'),
      },
      role: { $in: ['Superadmin', 'Admin'] },
      isActive: true,
      isDeleted: false,
    });
    if (result == null) {
      throw {
        code: 404,
        message: message.emailNotFound,
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
    const token = JWTSign(
      {
        id: result.id,
        randomKey: generateSalt(8),
        email: email.toLowerCase(),
        firstName: result.firstName,
        lastName: result.lastName,
      },
      JWTSecrete,
      {
        expiresIn: 86400,
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
      VIEW ADMIN DETAILS
 ---------------------------
 */

/**
 * @api {get} auth/details  Admin details
 * @apiName Admin details
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch profile details of admin
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    message: Admin Details fetched successfully
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
const adminDetails = async (req: Request, res: Response): Promise<any> => {
  try {
    const { currentUser } = req;

    if (currentUser) {
      const result = await UserModel.findById(currentUser.id);
      return res.status(200).json({
        responseCode: 200,
        message: message.viewSuccess.replace(':item', 'Admin'),
        data: result,
        success: true,
      });
    } else {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'Admin'),
        success: false,
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
    UPDATE ADMIN DETAILS
 ---------------------------
 */

/**
 * @api {put} /auth/update   Update Admin Profile
 * @apiName adminProfile
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription update admin profile details
 * @apiParam {String}  firstName firstName of the User.
 * @apiParam {String} email email of the User.
 * @apiParamExample {Object} Request-Example:
{
    "firstName": "Super-admin",
    "email": "superadmin@coinfied.com"
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message: "Admin profile updated successfully",
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
const adminProfile = async (req: Request, res: Response): Promise<any> => {
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
        email: body.email,
        role: 'Superadmin',
        isActive: true,
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
      const result = await UserModel.update(
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
        message: message.updateSuccess.replace(':item', 'Admin Profile'),
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
 * @apiName adminChangePassword
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Change Password of admin
 * @apiParam {String} oldPassword Old Password of the Admin.
 * @apiParam {String} newPassword new Password of the Admin.
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
const adminChangePassword = async (
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
    console.log('users', users);

    if (!comparePassword(body.oldPassword, users.password)) {
      throw {
        code: 400,
        message: message.passwordNotMatch.replace('Password', 'Old Password'),
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
 ---------------------------
       FORGOT PASSWORD
 ---------------------------

 * @api {get} auth/forgot-password   Forgot password
 * @apiName forgotPassword
 * @apiGroup SuperAdmin
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
    });
    if (result === null) {
      throw {
        code: 400,
        message: message.emailNotFound,
      };
    }
    body.email = encrypt(result.email);
    body.id = encrypt(result._id);
    body.verifyToken = encrypt(result.email + result.id);
    const updateToken: Document = await UserModel.updateOne(
      {
        email: result.email.toLowerCase(),
        _id: result._id,
      },
      {
        verifyToken: body.verifyToken,
      }
    );
    // const email = new Email(req);
    // await email.setTemplate("FORGOTPASSWORD", {
    //   firstName: result.firstName,
    //   lastName: result.lastName,
    //   email: body.email,
    //   _id: body.id,
    //   verifyToken: body.verifyToken,
    //   WebURL: webURL
    // });
    // console.log("email", email);

    // await email.sendEmail(result.email);
    return res.status(200).json({
      message: message.emailSent,
      data: updateToken,
      success: true,
    });

    // Fetch email template from db
    // const emailData: any = await EmailTemplateModel.findOne({
    //   templateName: 'Registration',
    // });
    // console.log(emailData, ':::::::::::::::');

    // const email = new Email(req);
    // await email.setTemplate(emailData.htmlContent, {
    //   first_name: 'Aayushi',
    //   email_address: 'ayushij.chapter247@gmail.com',
    //   password: '12345678',
    // });
    // console.log('email', email);
    // await email.sendEmail('ayushij.chapter247@gmail.com');
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
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Reset password through jwt token verification
 * @apiParam {String}  email email of the User.
 * @apiParam {String}  password new password of the User.
 * @apiParam {String}  verifytoken token of the User.
 * @apiParam {String}  id id of the Admin.
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
    const email: string = body.email.toLowerCase();
    const id: string = body._id;
    const verifyToken: string = body.verifyToken;
    var salt = generateSalt(6);
    body.salt = salt;
    body.password = encryptPassword(body.password, salt);
    const result: Document = await UserModel.update(
      {
        _id: id,
        email: email.toLowerCase(),
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
 * Admin Proxy Login
 */

const adminProxyLogin = async (req: Request, res: Response): Promise<any> => {
  const { body } = req;
  const { id } = body;
  console.log(id);

  try {
    const result: Document | null | any = await UserModel.findOne({
      _id: id,
      isDeleted: false,
    });
    console.log(result);

    if (!result) {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'Data'),
        success: true,
      });
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
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
        phoneNumber: result.phoneNumber,
        courseId: result.courseId,
      },
      JWTSecrete,
      {
        expiresIn: 86400,
      }
    );
    return res.status(200).json({
      responseCode: 200,
      token: token,
      data: result,
      message: message.loggedIn,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      responsecode: 500,
      message: error.message ? error.message : message.unexpectedError,
      success: false,
    });
  }
};

export {
  login,
  adminDetails,
  adminProfile,
  adminChangePassword,
  forgotPassword,
  resetPassword,
  adminProxyLogin,
};
