import { Request, Response } from 'express';
import * as fastCsv from 'fast-csv';
import fs from 'fs';
import path from 'path';
const TalentLMS: any = require('talentlms');
import { ModuleModel, TransactionModel, UserModel } from '../../models';
import moment from 'moment';
import { Document, Types } from 'mongoose';
import { message } from '../../common';

import { isNull } from 'util';

/**
 ----------------------------
     GET ALL TRANSACTION
 ----------------------------
 */

/**
 * @api {get} transaction/  Get Transaction list
 * @apiName getTransaction
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch Transaction details
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message:"Transaction list fetched successfully",
 *   responseCode: 200,
      data: result,
      totalRecords,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const getTransactionList = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { query } = req;
    const searchValue: any = query.searchValue || '';
    const promoCode: any = query.promoCode || '';
    let skip: any = query.skip || 1;
    let limit: any = query.limit || 10;
    const fromDate: any = query.fromDate || '';
    const toDate: any = query.toDate || '';
    let condition: object = {};

    skip = (skip - 1) * limit;
    if (searchValue) {
      condition = {
        ...condition,
        $or: [
          {
            fullName: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            'user.email': {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            'module.moduleName': {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            transactionId: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            grandTotal: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            subTotal: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            discountedAmount: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            promoCode: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            createdAt: {
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
    if (fromDate && toDate && fromDate !== 'null' && toDate !== 'null') {
      condition = {
        ...condition,
        createdAt: {
          $gte: moment.utc(fromDate).startOf('day').toDate(),
          $lte: moment.utc(toDate).endOf('day').toDate(),
        },
      };
    }
    if (promoCode) {
      condition = {
        ...condition,
        promoCode,
      };
    }
    const result: Document[] = await TransactionModel.aggregate([
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
          from: 'modules',
          as: 'module',
          foreignField: '_id',
          localField: 'moduleId',
        },
      },
      /* {
        $unwind: '$module',
      }, */
      {
        $addFields: {
          fullName: {
            $concat: ['$user.firstName', ' ', '$user.lastName'],
          },
          // createdAt: { $dateToString: { format: "%mmm %d, %Y", date: "$createdAt" } },
        },
      },
      // { $group: { _id: '$transactionId' } },
      {
        $group: {
          _id: '$transactionId',
          // courses: {
          //   $addToSet: '$course',
          // },
          fullName: {
            $first: '$fullName',
          },
          user: {
            $first: '$user',
          },
          module: {
            $addToSet: '$module',
          },
          transactionId: {
            $first: '$transactionId',
          },
          expireDate: {
            $first: '$expireDate',
          },
          promoCode: {
            $first: '$promoCode',
          },
          subTotal: {
            $first: '$subTotal',
          },
          siteDiscount: {
            $first: '$siteDiscount',
          },
          grandTotal: {
            $first: '$grandTotal',
          },
          createdAt: {
            $first: '$createdAt',
          },
          discountedAmount: {
            $first: '$discountedAmount',
          },
        },
      },

      {
        $match: condition,
      },

      { $sort: { _id: -1 } }, // Use this to sort documents by newest first
      { $skip: parseInt(skip) }, // Always apply 'skip' before 'limit'
      { $limit: parseInt(limit) }, // This is your 'page size'
    ]);

    const totalRecords: Document[] | any = await TransactionModel.aggregate([
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
        $addFields: {
          fullName: {
            $concat: [
              '$user.firstName',
              ' ',
              //  { $ifNull: ['$middleName', ''] },
              // ' ',
              '$user.lastName',
            ],
          },
        },
      },
      {
        $group: {
          _id: '$transactionId',
          // courses: {
          //   $addToSet: '$course',
          // },
          fullName: {
            $first: '$fullName',
          },
          user: {
            $first: '$user',
          },
          // module: {
          //   $addToSet: '$modules',
          // },
          transactionId: {
            $first: '$transactionId',
          },
          expireDate: {
            $first: '$expireDate',
          },
          promoCode: {
            $first: '$promoCode',
          },
          subTotal: {
            $first: '$subTotal',
          },
          grandTotal: {
            $first: '$grandTotal',
          },
          discountedAmount: {
            $first: '$discountedAmount',
          },
          siteDiscount: {
            $first: '$siteDiscount',
          },
          createdAt: {
            $first: '$createdAt',
          },
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
      responseCode: 200,
      message: message.listFetchSuccess.replace(':item', 'Transaction'),
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
 ------------------------------
       VIEW TRANSACTION
 ------------------------------
 */

/**
 * @api {get} transaction/:id  Transaction details
 * @apiName viewTransaction
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch a Transaction details
 * @apiParam {String} _id id of the Transaction.
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    message:"Transaction details fetched successfully",
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

const viewTransaction = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;
    const { id }: string | any = params;

    // const result: Document | any = await TransactionModel.findOne({_id: id}).populate('users')

    const result: Document[] | any = await TransactionModel.aggregate([
      {
        $match: { _id: Types.ObjectId(id) },
      },
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
        $addFields: {
          fullName: {
            $concat: [
              '$user.firstName',
              ' ',
              //  { $ifNull: ['$middleName', ''] },
              // ' ',
              '$user.lastName',
            ],
          },
        },
      },
    ]);

    if (result == null) {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'Data'),
        success: true,
      });
    }
    return res.status(200).json({
      message: message.viewSuccess.replace(':item', 'Transaction'),
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
 -------------------------
   EXPORT TRANSACTION CSV
 -------------------------
 */

/**
 * @api {get} transaction/transaction-csv  Get csv file of Transaction
 * @apiName exportsTransactionCsv
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To Download csv file of Transaction
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const exportsTransactionCsv = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const fileName: any = `transaction${Date.now()}.csv`;

    const ws: any = fs.createWriteStream(
      path.join(path.dirname(__dirname), `app/public/uploads/csv/${fileName}`)
    );

    const data: Document[] = await TransactionModel.aggregate([
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
          from: 'modules',
          as: 'module',
          foreignField: '_id',
          localField: 'moduleId',
        },
      },
      /* {
        $unwind: '$module',
      }, */
      {
        $addFields: {
          fullName: {
            $concat: ['$user.firstName', ' ', '$user.lastName'],
          },
          // createdAt: { $dateToString: { format: "%mmm %d, %Y", date: "$createdAt" } },
        },
      },
      // { $group: { _id: '$transactionId' } },
      {
        $group: {
          _id: '$transactionId',
          // courses: {
          //   $addToSet: '$course',
          // },
          name: {
            $first: '$fullName',
          },
          // user: {
          //   $first: '$user',
          // },
          // module: {
          //   $addToSet: '$module',
          // },
          transactionId: {
            $first: '$transactionId',
          },
          expireDate: {
            $first: '$expireDate',
          },
          createdAt: {
            $first: '$createdAt',
          },
          promoCode: {
            $first: '$promoCode',
          },
          grandTotal: {
            $first: '$subTotal',
          },
          discount: {
            $first: '$siteDiscount',
          },
          discountedTotal: {
            $first: '$grandTotal',
          },
          discountedAmount: {
            $first: '$discountedAmount',
          },
        },
      },

      {
        $project: {
          _id: 0,
          name: 1,
          promoCode: 1,
          transactionId: 1,
          // chargeId: 1,
          grandTotal: 1,
          discountedTotal: 1,
          discount: 1,
          discountedAmount: 1,
          expireDate: 1,
          createdAt: 1,
        },
      },
      { $sort: { _id: -1 } }, // Use this to sort documents by newest first
    ]);
    // const data: Document[] = await TransactionModel.aggregate([
    //   {
    //     $lookup: {
    //       from: 'users',
    //       as: 'user',
    //       foreignField: '_id',
    //       localField: 'userId',
    //     },
    //   },
    //   {
    //     $unwind: '$user',
    //   },
    //   {
    //     $addFields: {
    //       name: {
    //         $concat: [
    //           { $ifNull: ['$user.firstName', ''] },
    //           ' ',
    //           { $ifNull: ['$user.lastName', ''] },
    //         ],
    //       },
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: 'modules',
    //       as: 'module',
    //       foreignField: '_id',
    //       localField: 'moduleId',
    //     },
    //   },

    //   {
    //     $project: {
    //       _id: 0,
    //       name: 1,
    //       promoCode: 1,
    //       transactionId: 1,
    //       // chargeId: 1,
    //       grandTotal: '$subTotal',
    //       discountedTotal: '$grandTotal',
    //       discountedAmount: '$discountedAmount',
    //       expireDate: 1,
    //       createdAt: 1,
    //     },
    //   },
    //   { $sort: { _id: -1 } }, // Use this to sort documents by newest first
    // ]);

    await fastCsv
      .write(data, { headers: true })
      .on('finish', function () {
        console.log('Write to csv successfully!');
      })
      .pipe(ws);
    setTimeout(() => {
      // const downloadPath: any = `app/public/uploads/csv/${fileName}`;
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

    // return res.status(200).json({
    //   message: 'Transaction csv generated successfully',
    //   success: true,
    //   responseCode: 200,
    //   downloadPath,
    //   // data: data,
    // });
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

// removeUserFromTlmsCourse cron job
const removeUserFromTlmsCourse = async (): // req: Request,
// res: Response
Promise<any> => {
  try {
    const transaction: Document | any = await TransactionModel.find(
      {
        expireDate: { $lt: moment().toDate() },
      },
      { userId: 1, moduleId: 1, _id: 0 }
    );
    const talentLMS = new TalentLMS(
      process.env.TALENTLMSURL,
      process.env.TALENTLMSAPIKEY
    );
    for (const iterator of transaction) {
      if (iterator.moduleId != null) {
        const userDetails = await UserModel.findOne({
          _id: iterator.userId,
        });

        const module: Document[] | null | any = await ModuleModel.find({
          _id: { $in: iterator.moduleId },
        });
        let tlmsCourseId: any = [];
        for (const iterator of module) {
          await tlmsCourseId.push(iterator.talentLmsCourseId.toString());
        }

        for (let index = 0; index < tlmsCourseId.length; index++) {
          let course_id: any = tlmsCourseId[index];
          let user_id: any = userDetails.talentLmsUserId;

          const removeUserToCourse: Document | any =
            await talentLMS.Courses.removeUserFromCourse(course_id, user_id);
          // console.log('removeUserToCourse', removeUserToCourse);
        }
      }
    }
    // return res.status(200).json({
    //   message: message.userRemoved,
    //   responseCode: 200,
    //   data: transaction,
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
export {
  getTransactionList,
  exportsTransactionCsv,
  viewTransaction,
  removeUserFromTlmsCourse,
};
