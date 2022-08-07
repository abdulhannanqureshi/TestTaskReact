import { Request, Response } from 'express';
import {
  CourseTopicModel,
  CourseModel,
  ModuleModel,
  PromoModel,
  TransactionModel,
  LabsModel,
} from '../../models';
import { Document, Types } from 'mongoose';
import { message } from '../../common';
import { IUserTokenData } from '../../interfaces';
import { verify as VerifyJWT } from 'jsonwebtoken';
import { JWTSecrete } from '../../common/password';
import moment from 'moment';

/**
 -------------------------
   GET ALL COURSE TOPICS
 -------------------------
 */

/**
 * @api {get} course-topic/  Get Course Topic list
 * @apiName getCourseTopics
 * @apiGroup Frontend
 * @apiPermission none
 * @apiDescription To fetch Course Topic details
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   responseCode: 200,
 *   message:"Course Topic list fetched successfully",
      data: result,
      totalRecords,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const getCourseTopics = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query } = req;
    const isActive: any = query.isActive || '';
    const skip: any = query.skip || 0;
    let limit: any = query.limit || 5;
    if (limit === 'all') {
      // Sort user name by A-Z
      limit = '0';
    }
    // let condition: object = {};
    // if (isActive === 'true') {
    //   condition = { ...condition, isActive: true };
    // }
    // if (isActive === 'false') {
    //   condition = { ...condition, isActive: false };
    // }
    const result: Document[] = await CourseTopicModel.find({
      isDeleted: false,
      isActive: true,
    })
      .sort({ talentLmsCategoryId: 1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    return res.status(200).json({
      message: message.listFetchSuccess.replace(':item', 'Course Topic'),
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
   VIEW COURSE TOPIC
 -------------------------
 */

/**
 * @api {get} course-topic/:id  Get Course Topic Detail
 * @apiName getCourseTopicInfo
 * @apiGroup Frontend
 * @apiPermission none
 * @apiDescription To fetch A Course Topic details
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   responseCode: 200,
 *   message:"Course Topic details fetched successfully",
      data: result,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const getCourseTopicInfo = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { params } = req;
    const { id }: string | any = params;
    let userId: string = 'null';
    console.log(params, 'paramsparams');

    try {
      const token: string = req.headers['authorization']
        ? req.headers['authorization'].toString()
        : '';

      if (token) {
        const tokenData: IUserTokenData = VerifyJWT(
          token,
          JWTSecrete
        ) as IUserTokenData;

        userId = tokenData.id;
      }
    } catch (error) {
      console.log('sasas 1245test');
      console.log(error, ' test');
    }
    console.log('out out ');
    const result: Document[] = await CourseTopicModel.findOne({
      _id: Types.ObjectId(id),
      isDeleted: false,
      isActive: true,
    });
    const courses: any = await CourseModel.find(
      {
        topic: Types.ObjectId(id),
        isDeleted: false,
        isActive: true,
      },
      { title: 1, price: 1, talentLmsCourseId: 1 }
    ).sort({ talentLmsCourseId: 1 });
    // let lab: any = await LabsModel.findOne(
    //   {
    //     category: Types.ObjectId(id),
    //     isDeleted: false,
    //     isActive: true,
    //   },
    //   { _id: 1, category: 1, title: 1, description: 1, amount: 1, labsImage: 1 }
    // ).lean();

    let courseData = [];
    for (let x in courses) {
      let lab: any = await LabsModel.findOne(
        {
          course: Types.ObjectId(courses[x]._id),
          isDeleted: false,
          isActive: true,
        },
        {
          _id: 1,
          course: 1,
          title: 1,
          description: 1,
          amount: 1,
          labsImage: 1,
        }
      ).lean();
      const promo: Document[] | any = await PromoModel.find({
        courseId: courses[x]._id,
        isActive: true,
        isDeleted: false,
        endDate: { $gte: moment().toDate() },
        startDate: { $lte: moment().toDate() },
      });
      let promoCode: any = [];

      if (promo.length > 0) {
        for (const iterator of promo) {
          await promoCode.push(iterator.promoCode.toString());
        }
      }
      const modules: any = await ModuleModel.find(
        {
          course: courses[x]._id,
          isDeleted: false,
          isActive: true,
        },
        { moduleName: 1, amount: 1 }
      ).sort({ code: 1 });

      let labPurchased: any = false;
      let moduleDetails: any = [];
      if (userId !== 'null') {
        if (lab) {
          let checkLabPurchased: Document | null | any =
            await TransactionModel.findOne({
              $and: [
                {
                  userId,
                },
                {
                  labId: lab._id,
                },
                {
                  courseId: courses[x]._id,
                },
              ],
            });
          if (checkLabPurchased !== null) {
            labPurchased = true;
          }
        }

        for (let x in modules) {
          let moduleTransaction: any = await TransactionModel.findOne({
            $and: [
              {
                userId,
              },
              {
                moduleId: { $in: modules[x]._id },
              },
            ],
          });
          if (moduleTransaction) {
            await moduleDetails.push({
              _id: modules[x]._id,
              moduleName: modules[x].moduleName,
              amount: modules[x].amount,
              isPurchased: true,
            });
          } else {
            await moduleDetails.push({
              _id: modules[x]._id,
              moduleName: modules[x].moduleName,
              amount: modules[x].amount,
              isPurchased: false,
            });
          }
        }
      } else {
        moduleDetails = modules;
      }

      if (lab) {
        lab = { ...lab, labPurchased };
      }
      courseData.push({
        _id: courses[x]._id,
        title: courses[x].title,
        talentLmsCourseId: courses[x].talentLmsCourseId,
        price: courses[x].price,
        promoCode,
        modules: moduleDetails,
        lab: lab ? lab : {},
      });
      console.log(courseData, 'this is data');
    }
    const generalPromoCode: Document[] | any = await PromoModel.find({
      courseId: null,
      isActive: true,
      isDeleted: false,
      endDate: { $gte: moment().toDate() },
      startDate: { $lte: moment().toDate() },
    });
    let generalPromo: any = [];

    if (generalPromoCode.length > 0) {
      for (const iterator of generalPromoCode) {
        await generalPromo.push(iterator.promoCode.toString());
      }
    }
    return res.status(200).json({
      message: message.listFetchSuccess.replace(':item', 'Course Topic'),
      responseCode: 200,
      data: {
        course: result,
        moduleDetails: courseData,
        generalPromoCode: generalPromo,
      },
      success: true,
    });
  } catch (error) {
    console.log(error, 'error');
    res.status(500).json({
      message:
        error instanceof Error && error.message
          ? error.message
          : message.unexpectedError,
      success: false,
    });
  }
};

export { getCourseTopics, getCourseTopicInfo };
