import { Request, Response } from 'express';
import {
  CertificateRequestModel,
  CourseModel,
  EmailTemplateModel,
  UserModel,
} from '../../models';
import { Document, Types } from 'mongoose';
import moment from 'moment';
import { decrypt, Email, encrypt, message, pdfCertificate } from '../../common';
//import { message } from '../../common';

/**
 -------------------------------
   GET ALL CERTIFICATE REQUEST
 -------------------------------
 */

/**
 * @api {get} certificate-request/  Get Certificate Request list
 * @apiName getList
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch Certificate Request details
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message: Certificate Request list fetched successfully
 *   responseCode: 200,
      data: result,
      totalRecords,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const getList = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query } = req;
    const searchValue: any = query.searchValue || '';
    const status: any = query.status || '';
    let skip: any = query.skip || 0;
    let limit: any = query.limit || 10;
    const fromDate: any = query.fromDate || '';
    const toDate: any = query.toDate || '';
    let condition: object = {};
    let sort: any = { createdAt: -1 };
    skip = (skip - 1) * limit;
    if (searchValue) {
      condition = {
        $or: [
          {
            fullName: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            'course.title': {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            'user.firstName': {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            'user.lastName': {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            'user.email': {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
        ],
      };
    }

    if (fromDate && toDate && fromDate !== 'null' && toDate !== 'null') {
      console.log(fromDate, "fromDatefromDate");
      console.log(toDate, "toDatetoDate");

      condition = {
        ...condition,
        createdAt: {
          $gte: moment.utc(fromDate).startOf('day').toDate(),
          $lte: moment.utc(toDate).endOf('day').toDate(),
        },
      };
    }
    if (status) {
      condition = { ...condition, status };
    }

    const result: Document[] | any = await CertificateRequestModel.aggregate([
      {
        $lookup: {
          from: 'users',
          as: 'user',
          foreignField: '_id',
          localField: 'userId',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $lookup: {
          from: 'courses',
          as: 'course',
          foreignField: '_id',
          localField: 'courseId',
        },
      },
      {
        $unwind: '$course',
      },
      {
        $addFields: {
          fullName: {
            $concat: ['$user.firstName', ' ', '$user.lastName'],
          },
        },
      },
      {
        $match: condition,
      },
      {
        $project: {
          firstName: '$user.firstName',
          lastName: '$user.lastName',
          email: '$user.email',
          courseName: '$course.title',
          status: 1,
          linkExpireDate: 1,
          createdAt: 1,
          validTo: 1,
          validFrom: 1,
        },
      },
      { $sort: sort }, // Use this to sort documents by newest first
      { $skip: parseInt(skip) }, // Always apply 'skip' before 'limit'
      { $limit: parseInt(limit) }, // This is your 'page size'
    ]);

    const totalRecords: Document[] | any =
      await CertificateRequestModel.aggregate([
        {
          $lookup: {
            from: 'users',
            as: 'user',
            foreignField: '_id',
            localField: 'userId',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $lookup: {
            from: 'courses',
            as: 'course',
            foreignField: '_id',
            localField: 'courseId',
          },
        },
        {
          $unwind: '$course',
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
      message: message.listFetchSuccess.replace(':item', 'Certificate request'),
      data: result,
      totalRecords:
        totalRecords && totalRecords.length ? totalRecords[0].count : 0,
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
     UPDATE CERTIFICATE STATUS
 ---------------------------------
 */
/**
 * @api {put} /certificate-request/update-status/:id  Update Certificate status
 * @apiName updateCertificateStatus
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription  API for Update Certificate Status
 * @apiParam {Boolean} status  Status of the Certificate Request.
 * @apiParam {String} id id of the Certificate Request.
 * @apiParamExample {Object} Request-Example:
{
  status: 'Approve'
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:'Status updated successfully!',
 *   responseCode: 200,
 *   data: result,
 *  success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const updateCertificateStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body, params } = req;
    const { status } = body;
    const { id }: string | any = params;

    let result: Document | any;
    if (status != 'Approve' && status != 'PaymentLink') {
      result = await CertificateRequestModel.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            status: status,
          },
        }
      );
    }

    if (status === 'PaymentLink') {
      let date = new Date();
      date.setDate(date.getDate() + 1); // Now
      await CertificateRequestModel.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            linkExpireDate: date,
            status: 'Awaiting Payment',
          },
        }
      );
      const certificate: Document | any = await CertificateRequestModel.findOne(
        {
          _id: id,
        }
      );
      const user: Document | any = await UserModel.findOne({
        _id: Types.ObjectId(certificate.userId),
      });
      const course: Document | any = await CourseModel.findOne({
        _id: Types.ObjectId(certificate.courseId),
      });

      // const expireDate: any = encrypt(date);

      const certificateId: any = encrypt(id);

      try {
        // email template for registration
        const availableTemplate: any = await EmailTemplateModel.findOne({
          templateName: {
            $regex: new RegExp('payment-link'.trim(), 'i'),
          },
        });

        if (availableTemplate) {
          const upperCaseFirstName = `${user.firstName}`.charAt(0).toUpperCase() +`${user.firstName}`.slice(1);
          const upperCaseLastName = `${user.lastName}`.charAt(0).toUpperCase() +`${user.lastName}`.slice(1);
          const fullName: string = `${upperCaseFirstName} ${upperCaseLastName}`;
          const emailInstance: any = new Email(req);
          await emailInstance.setTemplate(
            availableTemplate.subject,
            availableTemplate.htmlContent,
            {
              fullName,
              expireDate: moment(date).format('MM/DD/YYYY'),
              courseName: course.title,
              verifyToken: `${process.env.Live_PUBLIC_FRONTEND_ENDPOINT}/certificate-request/payment/${certificateId}`,
              certificatePaymentButton: `<a  style="color:white;
              padding:10px;
              background-color:#3272bd;
              cursor:pointer;
              text-decoration:none"  
               href="${process.env.Live_PUBLIC_FRONTEND_ENDPOINT}/certificate-request/payment/${certificateId}"
               >Pay now</a>`
            }
          );

          await emailInstance.sendEmail(user.email);
        }
      } catch (error) {
        return res.status(400).json({
          responseCode: 400,
          message: error.message,
        });
      }
    }

    // if (status === 'Approve') {
    //   const certificate: Document | any = await CertificateRequestModel.findOne(
    //     {
    //       _id: id,
    //     }
    //   );
    //   const user: Document | any = await UserModel.findOne({
    //     _id: Types.ObjectId(certificate.userId),
    //   });
    //   const course: Document | any = await CourseModel.findOne({
    //     _id: Types.ObjectId(certificate.courseId),
    //   });
    //   const mapObj = {
    //     fullName: `${user.firstName} ${user.lastName}`,
    //     date: moment(new Date()).format('DD/MM/YYYY'),
    //     heading: 'In Recognization of Successfully Completing the',
    //     title: course.title,
    //     // certificateBg: `${process.env.FILE_PATH}EmailTemplates/certificate-bg.png`,
    //   };
    //   console.log('mapObj', mapObj);

    //   const pdfPath = await pdfCertificate(mapObj, 'document');
    //   console.log('pdfPath', pdfPath);
    //   await CertificateRequestModel.updateOne(
    //     {
    //       _id: id,
    //     },
    //     {
    //       $set: {
    //         certificate: pdfPath,
    //         validTo: moment(Date.now()).add(1, 'years'),
    //         validFrom: Date.now(),
    //       },
    //     }
    //   );
    // }
    return res.status(200).json({
      responseCode: 200,
      success: true,
      message: result
        ? message.updateSuccess.replace(':item', 'Status')
        : 'Payment Link Sent Successfully',
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
const checkExpiredPaymentLink = async (): // req: Request,
  // res: Response
  Promise<any> => {
  try {
    //  const { body, params } = req;
    //  const { status } = body;
    // const { id }: string | any = params;

    // let result: Document | any;
    // let certificateIds: Document[] | any = [];
    // const certificateData: Document[] | any =
    //   await CertificateRequestModel.find(
    //     {
    //       status: 'Awaiting Payment',
    //       linkExpireDate: {
    //         $lte: new Date(moment().toDate()),
    //       },
    //     },
    //     { _id: 1 }
    //   );

    // for (const iterator of certificateData) {
    //   await certificateIds.push(iterator._id);
    // }

    // if (certificateData.length > 0) {
    //   result = await CertificateRequestModel.updateMany(
    //     {
    //       _id: {
    //         $in: certificateIds.map(function (value: any) {
    //           return Types.ObjectId(value);
    //         }),
    //       },
    //     },
    //     {
    //       $set: {
    //         status: 'Expired',
    //       },
    //     }
    //   );
    // }

    await CertificateRequestModel.updateMany(
      {
        status: 'Awaiting Payment',
        linkExpireDate: {
          $lte: new Date(moment().toDate()),
        },
      },
      {
        $set: {
          status: 'Expired',
        },
      }
    );

    // return res.status(200).json({
    //   responseCode: 200,
    //   success: true,
    // });
  } catch (error) {
    console.log(error);
    // res.status(500).json({
    //   message:
    //     error instanceof Error && error.message
    //       ? error.message
    //       : message.unexpectedError,
    //   success: false,
    // });
  }
};

export { getList, updateCertificateStatus, checkExpiredPaymentLink };
