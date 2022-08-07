import { Request, Response } from 'express';
import { Types } from 'mongoose';
import moment from 'moment';
import { generateExcelReport, message } from '../../common';
import { TransactionModel, UserModel } from '../../models';

/**
 -------------------------
      GET USER REPORTS
 -------------------------
 */

/**
 * @api {get} report/user  Get User Reports
 * @apiName userReport
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch User Report details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  message: User Report list fetched successfully
 *  success: true,
 *   responseCode: 200,
      data: result,
      totalRecords,  
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const userReport = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query } = req;
    const searchValue: any = query.searchValue || '';
    const isActive: any = query.isActive || '';
    let skip: any = query.skip || 0;
    const limit: any = query.limit || 10;
    const sortBy: any = query.sortBy || '';
    const fromDate: any = query.fromDate || '';
    const toDate: any = query.toDate || '';
    skip = (skip - 1) * limit;
    let condition: object = { role: { $ne: 'Superadmin' }, isDeleted: false };
    let sort: any = { createdAt: -1 };

    if (sortBy == 1) {
      sort = {
        createdAt: 1,
      };
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
            fullName: {
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

    const result: Document[] | any = await UserModel.aggregate([
      {
        $addFields: {
          fullName: {
            $concat: [
              '$firstName',
              ' ',
              //  { $ifNull: ['$middleName', ''] },
              // ' ',
              '$lastName',
            ],
          },
        },
      },
      {
        $match: condition,
      },

      {
        $project: {
          fullName: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
        },
      },
      { $sort: sort }, // Use this to sort documents by newest first
      { $skip: parseInt(skip) }, // Always apply 'skip' before 'limit'
      { $limit: parseInt(limit) },
    ]);
    const totalRecords: Document[] | number | any = await UserModel.aggregate([
      {
        $addFields: {
          fullName: {
            $concat: [
              '$firstName',
              ' ',
              //  { $ifNull: ['$middleName', ''] },
              // ' ',
              '$lastName',
            ],
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
      message: message.listFetchSuccess.replace(':item', 'User Report'),
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
 -------------------------
      GET SALES REPORTS
 -------------------------
 */

/**
 * @api {get} report/sales  Get sales Reports
 * @apiName salesReport
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch Sales Report details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  message: Sales Report list fetched successfully
 *  success: true,
 *   responseCode: 200,
      data: result,
      totalRecords,  
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const salesReport = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query } = req;
    const searchValue: any = query.searchValue || '';
    const isActive: any = query.isActive || '';
    let skip: any = query.skip || 0;
    const limit: any = query.limit || 10;
    const sortBy: any = query.sortBy || '';
    const fromDate: any = query.fromDate || '';
    const toDate: any = query.toDate || '';
    let condition: object = { isDeleted: false };
    let sort: any = { createdAt: -1 };
    skip = (skip - 1) * limit;
    if (sortBy == 1) {
      sort = {
        createdAt: 1,
      };
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
            'course.title': {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            fullName: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            lastName: {
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

    const result: Document[] | any = await TransactionModel.aggregate([
      {
        $lookup: {
          from: 'users',
          as: 'user',
          foreignField: '_id',
          localField: 'userId',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'promos',
          as: 'promo',
          foreignField: '_id',
          localField: 'promoId',
        },
      },
      {
        $unwind: {
          path: '$promo',
          preserveNullAndEmptyArrays: true,
        },
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
        $lookup: {
          from: 'modules',
          as: 'module',
          foreignField: '_id',
          localField: 'moduleId',
        },
      },
      {
        $lookup: {
          from: 'courses',
          as: 'course',
          foreignField: '_id',
          localField: 'module.course',
        },
      },
      {
        $unwind: {
          path: '$course',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: condition,
      },
      {
        $project: {
          transactionId: 1,
          grandTotal: 1,
          createdAt: 1,
          fullName: 1,
          promoCode: '$promo.promoCode',
          courseName: '$course.title',
        },
      },
      { $sort: sort }, // Use this to sort documents by newest first
      { $skip: parseInt(skip) }, // Always apply 'skip' before 'limit'
      { $limit: parseInt(limit) }, // This is your 'page size'
    ]);

    const totalRecords: Document[] | number | any =
      await TransactionModel.aggregate([
        {
          $lookup: {
            from: 'users',
            as: 'user',
            foreignField: '_id',
            localField: 'userId',
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
          $lookup: {
            from: 'modules',
            as: 'module',
            foreignField: '_id',
            localField: 'moduleId',
          },
        },
        {
          $lookup: {
            from: 'courses',
            as: 'course',
            foreignField: '_id',
            localField: 'module.course',
          },
        },
        {
          $unwind: {
            path: '$course',
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
      message: message.listFetchSuccess.replace(':item', 'Sales Report'),
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

const exportReport = async (req: Request, res: Response): Promise<any> => {
  const styles = {
    headerDark: {
      fill: {
        fgColor: {
          // rgb: '000000'
        },
      },
      font: {
        color: {
          rgb: 'FFFFFFFF',
          /* rgb: '00000' */
        },
        sz: 12,
        bold: true,
        fontfamily: 'Times New Roman',
      },
    },
  };
  //Here you specify the export structure
  const specification = {
    courseCustomId: {
      // <- the key should match the actual data key
      displayName: 'Course Id', // <- Here you specify the column header
      headerStyle: styles.headerDark, // <- Header style
      width: 70, // <- width in pixels
    },
    courseName: {
      displayName: 'Course Name',
      headerStyle: styles.headerDark,
      width: 70, // <- width in chars (when the number is passed as string)
    },
    studentCustomId: {
      displayName: 'Student ID',
      headerStyle: styles.headerDark,
      width: 70,
    },
    firstName: {
      displayName: 'Student First Name',
      headerStyle: styles.headerDark,
      width: 220,
    },
    lastName: {
      displayName: 'Student Last Name',
      headerStyle: styles.headerDark,
      width: 220,
    },
    enrolledDate: {
      displayName: 'Enrolled Date',
      headerStyle: styles.headerDark,
      width: 120,
    },
    startDate: {
      displayName: 'Started Date',
      headerStyle: styles.headerDark,
      width: 220,
    },
    completedPercentage: {
      displayName: 'Percent Complete',
      headerStyle: styles.headerDark,
      width: 220,
    },
    complete: {
      displayName: 'Completed',
      headerStyle: styles.headerDark,
      width: 120,
    },
    completionDate: {
      displayName: 'Completion Date/Time',
      headerStyle: styles.headerDark,
      width: 70,
    },
    totalScore: {
      displayName: 'Final Course Test Score',
      headerStyle: styles.headerDark,
      width: 180,
    },
  };
  const { currentUser, query } = req;
  const searchValue: any = query.searchValue || '';
  const courseName: any = query.courseName || '';
  let condition: object = {};

  if (searchValue) {
    condition = {
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
      ],
    };
  }
  if (courseName) {
    condition = {
      ...condition,
      'courseData.courseName': {
        $regex: new RegExp(courseName.trim(), 'i'),
      },
    };
  }

  const result: Document[] | any = await UserModel.aggregate([
    {
      $unwind: {
        path: '$courseId',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: {
        ...condition,
        createdBy: currentUser ? Types.ObjectId(currentUser.id) : null,
        isDeleted: false,
        userRole: 'Student',
        // 'courseData.status': 'active',
      },
    },
  ]);
  const dataset: any[] = [];
  for (let i = 0; i < result.length; i++) {
    const response: any = result[i];
    let tempObj: any;
    const { studentCustomId, firstName, lastName, courseId } = response;
    const {
      status,
      enrolledDate,
      startDate,
      completionDate,
      completedPercentage,
      totalScore,
    } = courseId;
    tempObj = {
      courseCustomId:
        courseId && courseId.courseId ? courseId.courseId.courseCustomId : '-',
      courseName:
        courseId && courseId.courseId ? courseId.courseId.courseName : '-',
      studentCustomId,
      firstName,
      lastName,
      enrolledDate: enrolledDate ? moment(enrolledDate).format('LL') : '-',
      startDate: startDate ? moment(startDate).format('LL') : '-',
      completedPercentage: completedPercentage || 0,
      complete: status === 'Completed' ? 'Yes' : 'No',
      completionDate: completionDate
        ? moment(completionDate).format('LL')
        : '-',
      totalScore: totalScore || 0,
    };
    dataset.push(tempObj);
  }
  const report = generateExcelReport(specification, dataset);
  // You can then return this straight
  // res.attachment(moment().format('YYYY_MM_DD') + '_student_report.xlsx'); // This is sails.js specific (in general you need to set headers)
  return res.status(200).send(report);
};

export { exportReport, userReport, salesReport };
