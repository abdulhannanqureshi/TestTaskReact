import { Request, Response } from 'express';
import moment from 'moment';
import {
  CertificateRequestModel,
  CourseModel,
  CourseTopicModel,
  LabsModel,
  ModuleModel,
  PromoModel,
  SettingModel,
  TransactionModel,
} from '../../models';
import { message } from '../../common';
import { AnyKeys, Document, Types } from 'mongoose';
import { IUserTokenData } from '../../interfaces';
import { sign as JWTSign, verify as VerifyJWT } from 'jsonwebtoken';
import { JWTSecrete } from '../../common/password';
import { getCardListOfUser } from '.';
/**
 -------------------------
      GET ALL COURSES
 -------------------------
 */

/**
 * @api {get} course/  Get Course list
 * @apiName getCourses
 * @apiGroup Frontend
 * @apiPermission user
 * @apiDescription To fetch Course details
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   responseCode: 200,
 *   message:"Course list fetched successfully",
      data: result,
      totalRecords,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const getCourses = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query } = req;
    const searchValue: any = query.searchValue || '';
    const isActive: any = query.isActive || '';
    const topic: any = query.topic || '';
    const skip: any = query.skip || 0;
    let limit: any = query.limit || 10;
    let condition: object = {};
    let sort: any = { createdAt: -1 };

    if (searchValue) {
      condition = {
        $or: [
          {
            title: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            subTitle: {
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
    // if (isActive !== '') {
    //   condition = { ...condition, isActive };
    // }

    if (isActive === 'true') {
      condition = { ...condition, isActive: true };
    }
    if (isActive === 'false') {
      condition = { ...condition, isActive: false };
    }
    if (topic !== '') {
      condition = { ...condition, topic };
    }

    const totalRecords: number = await CourseModel.countDocuments({
      ...condition,
      isDeleted: false,
    });
    const result: Document[] = await CourseModel.find({
      ...condition,
      isDeleted: false,
    })
      .sort(sort)
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    return res.status(200).json({
      responseCode: 200,
      success: true,
      message: message.listFetchSuccess.replace(':item', 'Course'),
      data: result,
      totalRecords,
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
 ----------------------------
  GET ALL PURCHASED COURSES
 ----------------------------
 */

/**
 * @api {get} course/  Get Course list
 * @apiName getPurchasedCourses
 * @apiGroup Frontend
 * @apiPermission user
 * @apiDescription To fetch Purchased Course details
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   responseCode: 200,
 *   message:"Purchased Course list fetched successfully",
      data: result,
      totalRecords,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const getPurchasedCourses = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { query, currentUser = { _id: '' } } = req;
    const searchValue: any = query.searchValue || '';
    const isActive: any = query.isActive || '';
    const topic: any = query.topic || '';
    const skip: any = query.skip || 0;
    let limit: any = query.limit || 10;
    let condition: object = { userId: currentUser._id };
    let sort: any = { createdAt: -1 };

    if (searchValue) {
      condition = {
        $or: [
          {
            'course.title': {
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
    if (isActive === 'true') {
      condition = { ...condition, isActive: true };
    }
    if (isActive === 'false') {
      condition = { ...condition, isActive: false };
    }
    let courseDuration: string = '';
    const globalSetting: Document | null | any = await SettingModel.findOne();
    courseDuration = globalSetting.courseDuration;

    let test: Document[] | any = await TransactionModel.aggregate([
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
          localField: 'courseId',
        },
      },
      // {
      //   $unwind: '$course',
      // },
      // {
      //   $lookup: {
      //     from: 'labs',
      //     as: 'lab',
      //     foreignField: '_id',
      //     localField: 'labId',
      //   },
      // },
      // {
      //   $unwind: '$lab',
      // },
      {
        $match: condition,
      },
      {
        $group: {
          _id: '$courseId',
          courses: {
            $addToSet: '$course',
          },
          labId: {
            $addToSet: '$labId',
          },
          modules: {
            $addToSet: '$module',
          },
        },
      },
      // {
      //   $unwind: '$courses',
      // },
      // {
      //   $unwind: '$modules',
      // },
      {
        $project: {
          _id: 0,
          courses: '$courses',
          modules: '$modules',
          labId: '$labId',
        },
      },
      { $sort: sort }, // Use this to sort documents by newest first
      { $skip: parseInt(skip) }, // Always apply 'skip' before 'limit'
      { $limit: parseInt(limit) }, // This is your 'page size'
    ]);
    //  console.log(test, 'test');

    let purchasedCourses: any = [];
    for (const iterator of test) {
      let moduleArr: any = [];
      if (iterator.modules.length) {
        iterator.modules.map((item: any) => {
          if (item.length) moduleArr.push(...item);
        });
      }
      let labID: any;
      if (iterator.labId && iterator.labId.length) {
        iterator.labId.map((item: any) => {
          if (item != null) labID = item;
        });
      }
      //  console.log(labID, 'labID');

      let obj = {
        courses: iterator.courses[0][0],
        modules: moduleArr,
        labId: labID === undefined ? null : labID,
      };
      //  console.log('obj', obj);

      purchasedCourses.push(obj);
    }

    let lab: any;
    for (let iterator of purchasedCourses) {
      if (iterator.labId !== null) {
        lab = await LabsModel.findOne(
          {
            _id: Types.ObjectId(iterator.labId),
            isDeleted: false,
          },
          { _id: 1, course: 1, title: 1, description: 1, link: 1 }
        ).lean();

        if (lab) {
          let category: any = await CourseModel.findOne(
            {
              _id: Types.ObjectId(lab.course),
            },
            { _id: 0, title: 1 }
          ).lean();
          lab = {
            ...lab,
            courseName: category.title,
          };
        }

        const labDataCheck: Document | null | any =
          await TransactionModel.findOne(
            {
              $and: [
                {
                  userId: currentUser._id,
                },
                {
                  labId: iterator.labId,
                },
              ],
            },
            {
              _id: 0,
              createdAt: 1,
              expireDate: 1,
            }
          ).lean();
        if (labDataCheck) {
          iterator.lab = {
            ...lab,
            purchasedDate: labDataCheck.createdAt,
            expireDate: labDataCheck.expireDate,
          };
        }
      }

      if (iterator.modules.length > 0) {
        await iterator.modules.map(async (item: any, index: any) => {
          const moduleData: Document | null | any =
            await TransactionModel.findOne(
              {
                $and: [
                  {
                    userId: currentUser._id,
                  },
                  {
                    moduleId: { $in: item._id },
                  },
                ],
              },
              {
                _id: 0,
                createdAt: 1,
                expireDate: 1,
              }
            ).lean();
          if (moduleData) {
            iterator.modules[index] = {
              ...item,

              purchasedDate: moduleData.createdAt,
              expireDate: moduleData.expireDate,
            };
          }
        });
      }
    }

    const certificateApprove: Document[] | null | any =
      await CertificateRequestModel.find({
        $and: [
          {
            userId: currentUser._id,
          },
          {
            status: { $eq: 'Approve' },
          },
        ],
      });
    let courseArr: any = [];

    if (certificateApprove && certificateApprove.length) {
      for (const iterator of certificateApprove) {
        await courseArr.push({
          courseId: iterator.courseId.toString(),
          certificate: iterator.certificate,
          validTo: iterator.validTo,
          validFrom: iterator.validFrom,
        });
      }

      for (let iterator of purchasedCourses) {
        let isMinorCourse: any = false;
        let minorCourse: Document | null | any = await CourseModel.findOne({
          _id: Types.ObjectId(iterator.courses._id),
          isDeleted: false,
          isActive: true,
        });
        if (minorCourse.price === '0') {
          isMinorCourse = true;
        }
        if (
          courseArr.find(
            (element: any) => element.courseId == iterator.courses._id
          )
        ) {
          let moduleIds: Document[] | null | any = await ModuleModel.find({
            course: Types.ObjectId(iterator.courses._id),
            isDeleted: false,
            isActive: true,
          });
          let isAllCoursePurchased: Boolean = false;
          if (moduleIds.length == iterator.modules.length) {
            isAllCoursePurchased = true;
          }

          iterator.courses = {
            ...iterator.courses,
            isGenerated: true,
            isMinorCourse,
            isAllCoursePurchased,
            certificate: courseArr.find(
              (element: any) => element.courseId == iterator.courses._id
            ).certificate,
            certificateValidTo: courseArr.find(
              (element: any) => element.courseId == iterator.courses._id
            ).validTo,
            certificateValidFrom: courseArr.find(
              (element: any) => element.courseId == iterator.courses._id
            ).validFrom,
          };
        } else {
          let moduleIds: Document[] | null | any = await ModuleModel.find({
            course: Types.ObjectId(iterator.courses._id),
            isDeleted: false,
            isActive: true,
          });
          let isAllCoursePurchased: Boolean = false;
          //&& iterator.labId !== null
          if (moduleIds.length == iterator.modules.length) {
            isAllCoursePurchased = true;
          }

          iterator.courses = {
            ...iterator.courses,
            isGenerated: false,
            isMinorCourse,
            isAllCoursePurchased,
          };
        }
      }
    } else {
      for (let iterator of purchasedCourses) {
        let isMinorCourse: any = false;
        let minorCourse: Document | null | any = await CourseModel.findOne({
          _id: Types.ObjectId(iterator.courses._id),
          isDeleted: false,
          isActive: true,
        });
        if (minorCourse.price === '0') {
          isMinorCourse = true;
        }
        let moduleIds: Document[] | null | any = await ModuleModel.find({
          course: Types.ObjectId(iterator.courses._id),
          isDeleted: false,
          isActive: true,
        });
        let isAllCoursePurchased: Boolean = false;
        if (moduleIds.length == iterator.modules.length) {
          isAllCoursePurchased = true;
        }
        iterator.courses = {
          ...iterator.courses,
          isAllCoursePurchased,
          isMinorCourse,
          isGenerated: false,
        };
      }
    }

    return res.status(200).json({
      responseCode: 200,
      success: true,
      message: message.listFetchSuccess.replace(':item', 'Purchased Courses'),
      data: purchasedCourses,
      courseDuration,
      totalRecords:
        purchasedCourses && purchasedCourses.length
          ? purchasedCourses.length
          : 0,
    });
  } catch (error) {
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
    VIEW COURSE DETAILS
 ---------------------------
 */

/**
 * @api {get} course/:id  Course details
 * @apiName viewCourse
 * @apiGroup Frontend
 * @apiPermission user
 * @apiDescription To fetch Course details
 * @apiParam {String} id id of the Course.
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    responseCode: 200
 *    message: "Course details fetched successfully",
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

const viewCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;

    const { id }: string | any = params;
    const token: string = req.headers['authorization']
      ? req.headers['authorization'].toString()
      : '';
    let userId: string = 'null';
    if (token) {
      const tokenData: IUserTokenData = VerifyJWT(
        token,
        JWTSecrete
      ) as IUserTokenData;

      userId = tokenData.id;
    }
    let condition: object = { course: Types.ObjectId(id) };
    let course: Document[] | any = await CourseModel.findOne({
      _id: id,
    });
    if (course === null) {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'Data'),
        success: false,
      });
    }
    const promo: Document[] | any = await PromoModel.find({
      courseId: id,
      isDeleted: false,
      isActive: true,
    });
    let promoCode: any = [];

    if (promo.length > 0) {
      for (const iterator of promo) {
        await promoCode.push(iterator.promoCode.toString());
      }
    }
    // course = { course, promoCode: promoCode };
    const result: Document[] | any = await ModuleModel.aggregate([
      {
        $match: condition,
      },

      {
        $project: {
          _id: 1,
          moduleName: 1,
          amount: 1,
          category: 1,
          talentLmsCourseId: 1,
          courseId: '$course',
        },
      },
    ]);

    let moduleDetails: any = [];
    if (userId !== 'null') {
      for (let x in result) {
        let modules = await TransactionModel.findOne({
          $and: [
            {
              userId,
            },
            {
              moduleId: { $in: result[x]._id },
            },
          ],
        });
        if (modules) {
          await moduleDetails.push({ ...result[x], isPurchased: true });
        } else {
          await moduleDetails.push({ ...result[x], isPurchased: false });
        }
      }
    } else {
      moduleDetails = result;
    }
    const generalPromoCode: Document[] | any = await PromoModel.find({
      courseId: null,
      isActive: true,
      isDeleted: false,
    });
    let generalPromo: any = [];

    if (generalPromoCode.length > 0) {
      for (const iterator of generalPromoCode) {
        await generalPromo.push(iterator.promoCode.toString());
      }
    }
    return res.status(200).json({
      responseCode: 200,
      success: true,
      message: message.viewSuccess.replace(':item', 'Course'),
      data: {
        course,
        promoCode,
        moduleDetails,
        generalPromoCode: generalPromo,
      },
    });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error && error.message
          ? error.message
          : message.unexpectedError,
      success: false,
    });
  }
};

export {
  getCourses,
  // getPurchasedCoursesForLab,
  viewCourse,
  getPurchasedCourses,
};
