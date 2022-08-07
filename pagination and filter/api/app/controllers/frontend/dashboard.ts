import { Request, Response } from 'express';
import moment from 'moment';
import {
  CourseModel,
  CourseTopicModel,
  TransactionModel,
  UserModel,
} from '../../models';
import { Document, Types } from 'mongoose';
import { validationResult } from 'express-validator';
import { ValidationFormatter } from '../../common/formatter';
import { message } from '../../common';

/**
 -------------------------------
   GET COURSES AND USER COUNT
 -------------------------------
 */

/**
 * @api {get} dashboard/courseAndPurchaseCount  Get Course & sales Count
 * @apiName getCoursesUserAndSalesCount
 * @apiGroup Frontend
 * @apiPermission user
 * @apiDescription To fetch total Course User & sales Count
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   responseCode: 200,
 *   message:"Course, User and Sales Count list fetched successfully",
      data: result,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const getCoursesUserAndSalesCount = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { query, currentUser = { id: '' } } = req;
    const today: any = query.today || '';
    const yesterday: any = query.yesterday || '';
    const thisWeek: any = query.thisWeek || '';
    const thisMonth: any = query.thisMonth || '';
    let condition: object = {
      isDeleted: false,
      userId: Types.ObjectId(currentUser.id),
    };
    let conditionSales: object = {
      isDeleted: false,
      userId: Types.ObjectId(currentUser.id),
    };
    console.log(currentUser.id);

    if (today === 'today') {
      condition = {
        ...condition,
        createdAt: {
          $gte: moment().startOf('day').toDate(),
          $lt: moment().endOf('day').toDate(),
        },
      };
    }

    if (yesterday === 'yesterday') {
      condition = {
        ...condition,
        createdAt: {
          $gte: moment().subtract(1, 'days').startOf('day').toDate(),
          $lte: moment().subtract(1, 'days').endOf('day').toDate(),
        },
      };
    }
    if (thisWeek === 'thisWeek') {
      condition = {
        ...condition,
        createdAt: {
          $gte: moment().startOf('week').toDate(),
          $lte: moment().endOf('week').toDate(),
        },
      };
    }
    //   console.log(moment().startOf('month'));
    //   console.log(moment().endOf('month'));

    if (thisMonth === 'thisMonth') {
      condition = {
        ...condition,
        createdAt: {
          $gte: moment().startOf('month').toDate(),
          $lte: moment().endOf('month').toDate(),
        },
      };
    }

    const purchasedCourses: Document[] | any = await TransactionModel.aggregate(
      [
        {
          $match: condition,
        },
        {
          $lookup: {
            from: 'modules',
            as: 'module',
            foreignField: '_id',
            localField: 'moduleId',
          },
        },
        // {
        //   $unwind: '$module',
        // },
        {
          $lookup: {
            from: 'courses',
            as: 'course',
            foreignField: '_id',
            localField: 'module.course',
          },
        },

        // {
        //   $unwind: '$course',
        // },

        {
          $group: {
            _id: 'null',
            courseIds: {
              $addToSet: '$course._id',
            },
          },
        },
        {
          $addFields: {
            courseId: {
              $reduce: {
                input: '$courseIds',
                initialValue: [],
                in: { $setUnion: ['$$value', '$$this'] },
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            courseId: 1,

            courseCount: { $size: '$courseId' },
          },
        },
      ]
    );

    if (today === 'today') {
      conditionSales = {
        ...conditionSales,
        createdAt: {
          $gte: moment().startOf('day').toDate(),
          $lt: moment().endOf('day').toDate(),
        },
      };
    }

    if (yesterday === 'yesterday') {
      conditionSales = {
        ...conditionSales,
        createdAt: {
          $gte: moment().subtract(1, 'days').startOf('day').toDate(),
          $lte: moment().subtract(1, 'days').endOf('day').toDate(),
        },
      };
    }
    if (thisWeek === 'thisWeek') {
      conditionSales = {
        ...conditionSales,
        createdAt: {
          $gte: moment().startOf('week').toDate(),
          $lte: moment().endOf('week').toDate(),
        },
      };
    }

    if (thisMonth === 'thisMonth') {
      conditionSales = {
        ...conditionSales,
        createdAt: {
          $gte: moment().startOf('month').toDate(),
          $lte: moment().endOf('month').toDate(),
        },
      };
    }

    const totalSales: Document[] | any = await TransactionModel.aggregate([
      {
        $match: conditionSales,
      },
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: { $toDouble: '$grandTotal' },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalSales: 1,
        },
      },
    ]);

    return res.status(200).json({
      responseCode: 200,
      message: message.listFetchSuccess.replace(
        ':item',
        'Course, User and Sales Count'
      ),
      success: true,

      data: {
        purchasedCourses:
          purchasedCourses && purchasedCourses.length
            ? purchasedCourses[0].courseCount
            : 0,
        totalPurchase:
          totalSales && totalSales.length ? totalSales[0].totalSales : 0,
      },
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

export { getCoursesUserAndSalesCount };
