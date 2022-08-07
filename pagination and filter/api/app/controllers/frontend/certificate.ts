import { Request, Response } from 'express';
import {
  CertificateRequestModel,
  CourseModel,
  CourseTopicModel,
  EmailTemplateModel,
  SettingModel,
  UserModel,
} from '../../models';
import { Document, Types } from 'mongoose';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import { decrypt, Email, message, pdfCertificate } from '../../common';
import moment from 'moment';
import path from 'path/posix';

/**
 ---------------------------
   ADD CERTIFICATE REQUEST
 --------------------------- 
 */
/**
 * @api {post} certificate-request/  Add Certificate Request
 * @apiName addCertificateRequest
 * @apiGroup Frontend
 * @apiPermission user
 * @apiDescription Add API for add Certificate Request
 * @apiParam {String} courseId id of the Course.
 
 * @apiParamExample {Object} Request-Example:
{
      "courseId":"615c609c4769a4658ea9bda7"    
       
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *    responseCode: 200,
      data: result,
      message: 'Certificate Request added successfully.',
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 400 Invalid request
 * {
 *      code: 400,
        message: 'Your certificate approval is under process',
        success: false,
 *}
 *  HTTP/1.1 400 Invalid request
 * {
 *      code: 400,
        message: 'Your certificate is already approved',
        success: false,
 *}
 *    HTTP/1.1 500 Internal Server Error
 */
const addCertificateRequest = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body, currentUser = { id: '' } } = req;
    const { courseId } = body;

    const certificatePending: Document | null | any =
      await CertificateRequestModel.findOne({
        $and: [
          {
            courseId,
          },
          {
            userId: currentUser.id,
          },
          {
            status: { $eq: 'Pending' },
          },
        ],
      });

    if (certificatePending) {
      return res.status(400).json({
        code: 400,
        message: message.certificatePending,
        success: false,
      });
    }
    const certificateApprove: Document | null | any =
      await CertificateRequestModel.findOne({
        $and: [
          {
            courseId,
          },
          {
            userId: currentUser.id,
          },
          {
            status: { $eq: 'Approve' },
          },
        ],
      });

    if (certificateApprove) {
      return res.status(400).json({
        code: 400,
        message: message.certificateApproved,
        isApproved: true,
        success: false,
      });
    }
    const data: object = {
      courseId,
      userId: currentUser.id,
    };
    const certificateData: Document = new CertificateRequestModel(data);
    const result: any = await certificateData.save();

    return res.status(200).json({
      message: message.addedSuccess.replace(':item', 'Certificate Request'),
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
 -----------------------------
    VIEW CERTIFICATE DETAILS
 -----------------------------
 */

/**
 * @api {get} certificate-request/:courseId  Certificate details
 * @apiName viewCertificate
 * @apiGroup Frontend
 * @apiPermission user
 * @apiDescription To fetch a Certificate details
 * @apiParam {String} courseId id of the course.
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    message:"Certificate details fetched successfully",
 *    responseCode: 200
 *    data: result
 *    success: true
 * }
 * @apiErrorExample {json} List error
 * HTTP/1.1 404 NotFound
 * {
 *    message: "Data not found.",
 *    responseCode: 404,
 *    success: false
 * }
 *    HTTP/1.1 500 Internal Server Error
 */
const viewCertificate = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params, currentUser = { id: '' } } = req;
    const { courseId }: string | any = params;
    const result: Document | null | any = await CertificateRequestModel.findOne(
      {
        $and: [
          {
            courseId,
          },
          {
            userId: currentUser.id,
          },
          {
            status: { $eq: 'Approve' },
          },
        ],
      }
    );
    if (!result) {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'Data'),
        success: true,
      });
    }

    return res.status(200).json({
      message: message.viewSuccess.replace(':item', 'Certificate'),
      success: true,
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
 -----------------------------------
     VIEW CERTIFICATE PAYMENT INFO
 -----------------------------------
 */

/**
 * @api {get} certificate-request/payment-info/certificateId   Certificate Payment details
 * @apiName viewCertificatePaymentInfo
 * @apiGroup Frontend
 * @apiPermission user
 * @apiDescription To fetch a Certificate details
 * @apiParam {String} courseId id of the course.
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    message:"Certificate Payment details fetched successfully",
 *    responseCode: 200
 *    data: result
 *    success: true
 * }
 * @apiErrorExample {json} List error
 * HTTP/1.1 404 NotFound
 * {
 *    message: "Data not found.",
 *    responseCode: 404,
 *    success: false
 * }
 *  *  HTTP/1.1 400 LinkExpired
 * {
 *      code: 400,
        message: 'This Link is Expired',
        success: false,
 *}
 *  HTTP/1.1 400 Invalid request
 * {
 *      code: 400,
        message: 'Your certificate is already approved',
        success: false,
 *}
 *    HTTP/1.1 500 Internal Server Error
 */
const viewCertificatePaymentInfo = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { params } = req;
    const { certificateId }: string | any = params;
    let id: any = decrypt(certificateId);

    const certificate: Document | null | any =
      await CertificateRequestModel.findOne({
        _id: id,
      });
    if (!certificate) {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'Data'),
        success: true,
      });
    }
    let linkExpireDate: any = certificate.linkExpireDate;
    const currentDate = new Date();
    if (linkExpireDate < currentDate) {
      return res.status(400).json({
        message: 'This Link Is Expired',
        success: false,
        responseCode: 400,
      });
    }
    if (certificate.status === 'Approve') {
      return res.status(400).json({
        message: 'Your certificate is already approved',
        success: false,
        responseCode: 400,
      });
    }
    const user: Document | any = await UserModel.findOne({
      _id: Types.ObjectId(certificate.userId),
    });
    const course: Document | any = await CourseModel.findOne({
      _id: Types.ObjectId(certificate.courseId),
    });

    let certificateAmount: Document | any = await SettingModel.findOne({});
    certificateAmount = certificateAmount.certificateAmount;
    const result: any = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      courseTitle: course.title,
      certificateAmount,
      linkExpireDate,
    };
    return res.status(200).json({
      message: message.viewSuccess.replace(':item', 'Certificate Payment'),
      success: true,
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
 -----------------------------------
    PAYMENT FOR CERTIFICATE REQUEST
 --------------------------- -------
 */
/**
 * @api {post} certificate-request/payment/:certificateId/:expireDate  For certificate payment
 * @apiName paymentForCertificate
 * @apiGroup Frontend
 * @apiPermission none
 * @apiDescription Add API for  Payment For Certificate Request
 * @apiParam {String} cardNumber Card Number of the User.
 * @apiParam {String} cardExpMonth card Expire Month of the User.
 * @apiParam {String} cardExpYear card Expire Year of the User.
 * @apiParam {String} cardCvc card Cvc of the User.
 * @apiParam {String} cardName card Name of the User.
 
 * @apiParamExample {Object} Request-Example:
{
      "cardNumber":"4242424242424242",
    "cardExpMonth":"10",
   "cardExpYear":"2025",
     "cardCvc":"123",
     "cardName":"visa",
         "certificateAmount":"Account",
      "courseTitle":"300",
       
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *    responseCode: 200,
      data: result,
      message: 'Payment successfully',
 * }
 * @apiErrorExample {json} List error

 *    HTTP/1.1 500 Internal Server Error
 */
const paymentForCertificate = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body, params } = req;

    const { certificateId } = params;
    let id: any = decrypt(certificateId);
    const {
      cardNumber,
      cardExpMonth,
      cardExpYear,
      cardCvc,
      cardName,
      certificateAmount,
      courseTitle,
      address_city = 'null',
      address_country = 'US',
      address_line1 = 'null',
      address_line2 = 'null',
      address_state = 'null',
      address_zip = '555225',
    } = body;

    // let decryptDate: any = decrypt(expireDate);
    // decryptDate = new Date(decryptDate);
    // const currentDate = new Date();
    // if (decryptDate < currentDate) {
    //   return res.status(400).json({
    //     message: 'This Link Is Expired',
    //     success: false,
    //     responseCode: 400,
    //   });
    // }

    const certificate: Document | any = await CertificateRequestModel.findOne({
      _id: id,
    });
    // if (certificate.status === 'Approve') {
    //   return res.status(400).json({
    //     message: 'Your certificate is already approved',
    //     success: false,
    //     responseCode: 400,
    //   });
    // }
    // let certificateAmount: Document | any = await SettingModel.findOne({});
    // certificateAmount = certificateAmount.certificateAmount;
    const user: Document | any = await UserModel.findOne({
      _id: Types.ObjectId(certificate.userId),
    });
    const cardToken = await stripe.tokens.create({
      card: {
        number: cardNumber,
        exp_month: cardExpMonth,
        exp_year: cardExpYear,
        cvc: cardCvc,
        name: cardName,
        // address_city ,
        address_country,
        address_line1,
        //  address_line2,
        //  address_state,
        //  address_zip,
      },
    });
    console.log(cardToken, 'this is card token');
    const charge = await stripe.charges.create({
      amount: Math.round(parseFloat(certificateAmount) * 100),
      currency: 'usd',
      source: cardToken.id,
      receipt_email: user.email,
      description: `Stripe Charge Of Amount ${certificateAmount} for Certificate`,
    });
    console.log(charge, 'this is charge');
    if (charge.status === 'succeeded') {
      let badgeImage: any = '';
      const course: Document | any = await CourseModel.findOne({
        _id: Types.ObjectId(certificate.courseId),
      });

      const topic: Document | any = await CourseTopicModel.findOne({
        _id: Types.ObjectId(course.topic),
      });
      badgeImage = topic.certificateImage;
      console.log('certificateImage', badgeImage);

      // console.log(charge, 'in if condition');
      // let tlmsCourseId: any = course.talentLmsCourseId;
      // let badgeImage: any = '';
      // switch (tlmsCourseId) {
      //   case '127':
      //   case '195':
      //     badgeImage = 'Accounting_L1';
      //     break;
      //   case '133':
      //   case '146':
      //     badgeImage = 'Cybersecurity_L1';
      //     break;
      //   case '134':
      //     badgeImage = 'Finance_L1';
      //     break;
      //   case '152':
      //   case '130':
      //     badgeImage = 'Solidity_L1';
      //     break;
      //   case '140':
      //     badgeImage = 'Taxation_L1';
      //     break;

      //   default:
      //     break;
      // }
      let validTo: any = moment(Date.now())
        .add(1, 'years')
        .format('DD/MM/YYYY');

      const mapObj = {
        //   fullName: `${user.firstName} ${user.lastName}`,
        //  date: moment(new Date()).format('DD/MM/YYYY'),
        validFrom: moment(new Date()).format('DD/MM/YYYY'),
        validTo,
        certificateBg: `${process.env.FILE_PATH}/${badgeImage}`,
        // heading: 'In Recognization of Successfully Completing the',
        //  title: courseTitle,
        // certificateBg: `${process.env.FILE_PATH}EmailTemplates/certificate-bg.png`,
      };
      console.log('mapObj', mapObj);

      const pdfPath = await pdfCertificate(mapObj, 'document');
      console.log('pdfPath', pdfPath);
      await CertificateRequestModel.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            certificate: pdfPath,
            status: 'Approve',
            validTo: moment(Date.now()).add(1, 'years'),
            validFrom: Date.now(),
          },
        }
      );
    }

    return res.status(200).json({
      message: message.paymentSuccess,
      success: true,
      responseCode: 200,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error && error.message
          ? error.message
          : message.unexpectedError,
    });
  }
};

const createCertificate = async (req: Request, res: Response): Promise<any> => {
  try {
    let badgeImage: any = 'Accounting_L1';
    const mapObj = {
      validFrom: moment(new Date()).format('DD/MM/YYYY'),
      validTo: moment(new Date()).format('DD/MM/YYYY'),
      certificateBg: `${process.env.FILE_PATH}/badgesImages/${badgeImage}.png`,
    };

    const pdfPath = await pdfCertificate(mapObj, 'document');

    return res.status(200).json({
      message: message.paymentSuccess,
      data: `${process.env.FILE_PATH}/${pdfPath}`,
      success: true,
      responseCode: 200,
    });
  } catch (error) {
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
  addCertificateRequest,
  viewCertificate,
  paymentForCertificate,
  viewCertificatePaymentInfo,
  createCertificate,
};
