import { Request, Response } from 'express';
import moment from 'moment';
import {
  CourseModel,
  CourseTopicModel,
  ModuleModel,
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
 * @api {get} dashboard/courseAndUserCount  Get Course, User & sales Count
 * @apiName getCoursesUserAndSalesCount
 * @apiGroup SuperAdmin
 * @apiPermission admin
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
    const { query } = req;
    const today: any = query.today || '';
    const yesterday: any = query.yesterday || '';
    const thisWeek: any = query.thisWeek || '';
    const thisMonth: any = query.thisMonth || '';
    let condition: object = {};
    let conditionSales: object = {};

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
    const availableCourse: number = await CourseModel.countDocuments({
      ...condition,
      isActive: true,
    });
    const registeredUser: number = await UserModel.countDocuments({
      ...condition,
      // isActive: true,
      isDeleted: false,
      role: { $in: ['Individual', 'Student', 'Corporate Employee'] },
    });

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

    const totalDemo: Document[] | any = await TransactionModel.aggregate([
      {
        $match: conditionSales,
      },
      {
        $group: {
          _id: '$transactionId',
          totalSales: {
            $addToSet: '$grandTotal',
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

    let totalSalesData: any = 0;
    if (totalDemo.length > 0) {
      for (const iterator of totalDemo) {
        await iterator.totalSales.map((item: any) => {
          totalSalesData += parseFloat(item);
        });
      }
    }

    const weeklySales: Document[] | any = await TransactionModel.aggregate([
      {
        $match: {
          isDeleted: false,
          createdAt: {
            $gte: moment().startOf('week').toDate(),
            $lte: moment().endOf('week').toDate(),
          },
        },
      },
      {
        $group: {
          _id: '$transactionId',
          totalSales: {
            $addToSet: '$grandTotal',
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
    let weeklySalesData: any = 0;
    if (weeklySales.length > 0) {
      for (const iterator of weeklySales) {
        await iterator.totalSales.map((item: any) => {
          weeklySalesData += parseFloat(item);
        });
      }
    }

    const monthlySales: Document[] | any = await TransactionModel.aggregate([
      {
        $match: {
          isDeleted: false,
          createdAt: {
            $gte: moment().startOf('month').toDate(),
            $lte: moment().endOf('month').toDate(),
          },
        },
      },
      {
        $group: {
          _id: '$transactionId',
          totalSales: {
            $addToSet: '$grandTotal',
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
    let monthlySalesData: any = 0;
    if (monthlySales.length > 0) {
      for (const iterator of monthlySales) {
        await iterator.totalSales.map((item: any) => {
          monthlySalesData += parseFloat(item);
        });
      }
    }

    const yearlySales: Document[] | any = await TransactionModel.aggregate([
      {
        $match: {
          isDeleted: false,
          createdAt: {
            $gte: moment().startOf('year').toDate(),
            $lte: moment().endOf('year').toDate(),
          },
        },
      },
      {
        $group: {
          _id: '$transactionId',
          totalSales: {
            $addToSet: '$grandTotal',
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

    let yearlySalesData: any = 0;
    if (yearlySales.length > 0) {
      for (const iterator of yearlySales) {
        await iterator.totalSales.map((item: any) => {
          yearlySalesData += parseFloat(item);
        });
      }
    }

    const todaySales: Document[] | any = await TransactionModel.aggregate([
      {
        $match: {
          isDeleted: false,
          createdAt: {
            $gte: moment().startOf('day').toDate(),
            $lte: moment().endOf('day').toDate(),
          },
        },
      },
      {
        $group: {
          _id: '$transactionId',
          totalSales: {
            $addToSet: '$grandTotal',
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

    let todaySalesData: any = 0;
    if (todaySales.length > 0) {
      for (const iterator of todaySales) {
        await iterator.totalSales.map((item: any) => {
          todaySalesData += parseFloat(item);
        });
      }
    }

    const courseTopics: Document[] | any = await CourseTopicModel.find({
      isDeleted: false,
      isActive: true,
    });
    let graphOfSales: any = [];
    for (const iterator of courseTopics) {
      let courseList: any = [];
      let moduleList: any = [];
      const courses: Document[] | any = await CourseModel.find({
        topic: Types.ObjectId(iterator._id),
        isDeleted: false,
        isActive: true,
      });
      for (const courseItem of courses) {
        await courseList.push(courseItem._id.toString());
      }
      const modules: Document[] | any = await ModuleModel.find({
        course: { $in: courseList },
        isDeleted: false,
        isActive: true,
      });
      for (const moduleItem of modules) {
        await moduleList.push(moduleItem._id.toString());
      }

      const user: Document[] | any = await TransactionModel.aggregate([
        {
          $match: {
            moduleId: {
              $in: moduleList.map(function (value: any) {
                return Types.ObjectId(value);
              }),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalUser: {
              $addToSet: '$userId',
            },
          },
        },
        {
          $project: {
            _id: 0,
            totalUser: 1,
          },
        },
      ]);
      let totalUser: any = user && user.length ? user[0].totalUser.length : 0;
      let obj: any = {
        label: iterator.topicName,
        value: totalUser,
      };
      await graphOfSales.push(obj);
    }

    return res.status(200).json({
      responseCode: 200,
      message: message.listFetchSuccess.replace(
        ':item',
        'Course, User and Sales Count'
      ),
      success: true,

      data: {
        availableCourse,
        registeredUser,
        purchasedCourses:
          purchasedCourses && purchasedCourses.length
            ? parseFloat(purchasedCourses[0].courseCount)
            : 0,
        totalSales: totalSalesData,

        yearlySales: yearlySalesData,
        // yearlySales:
        //   yearlySales && yearlySales.length
        //     ? parseFloat(yearlySales[0].totalSales)
        //     : 0,
        todaySales: todaySalesData,
        monthlySales: monthlySalesData,

        weeklySales: weeklySalesData,

        graphOfSales,
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
/**
 ---------------------------
        TOTALS SALES
 ---------------------------
 */

/**
 * @api {get} dashboard/totalSales  Get Total Sales Count
 * @apiName totalSales
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch Total Sales Count
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   responseCode: 200,
 *   message:"Course, Total Sales list fetched successfully",
      data: result,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const totalSales = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query } = req;
    const today: any = query.today || '';
    const yesterday: any = query.yesterday || '';
    const thisWeek: any = query.thisWeek || '';
    const thisMonth: any = query.thisMonth || '';
    let condition: object = { isDeleted: false, isActive: true };

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
        //  $and:[{
        createdAt: {
          $gte: moment().startOf('month').toDate(),
          $lte: moment().endOf('month').toDate(),
        },
        //  }],
      };
    }

    const totalSales: Document[] | any = await TransactionModel.aggregate([
      {
        $match: condition,
      },
      {
        $group: {
          _id: '$transactionId',
          totalSales: {
            $sum: '$grandTotal',
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
      message: message.listFetchSuccess.replace(':item', 'Total sales'),
      success: true,
      data: {
        totalSales:
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

export { getCoursesUserAndSalesCount, totalSales };
