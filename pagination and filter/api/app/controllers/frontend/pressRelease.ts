import { Request, Response } from 'express';
import { PressReleaseModel, PressReleaseCategoryModel } from '../../models';
import { Document, Types } from 'mongoose';
import { message } from '../../common';

/**
 ----------------------------
    GET ALL PRESS RELEASES
 ----------------------------
 */

/**
 * @api {get} press-release/  Get Press Release list
 * @apiName getPressRelease
 * @apiGroup Frontend
 * @apiPermission user
 * @apiDescription To fetch Press Release details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   responseCode: 200,
      data: result,
      totalRecords,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const getPressRelease = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query } = req;
    const searchValue: any = query.searchValue || '';
    const isActive: any = query.isActive || '';
    const categoryId: any = query.categoryId || '';
    const skip: any = query.skip || 0;
    let limit: any = query.limit || 10;
    const sortBy: any = query.sortBy || '';
    let condition: object = {
      isDeleted: false,
      isActive: true,
      'pressReleaseCategory.isActive': true,
      'pressReleaseCategory.isDeleted': false,
    };
    let sort: any = { createdAt: -1 };

    if (sortBy == 1) {
      // Sort user name by A-Z
      sort = {
        title: 1,
      };
    }
    if (limit === 'all') {
      // Sort user name by A-Z
      limit = '0';
    }
    if (searchValue) {
      condition = {
        ...condition,
        $or: [
          {
            title: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
        ],
      };
    }
    if (categoryId && categoryId !== '' && categoryId !== null) {
      condition = {
        ...condition,
        $or: [
          {
            category: Types.ObjectId(categoryId),
          },
        ],
      };
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
    const result: Document[] = await PressReleaseModel.aggregate([
      {
        $lookup: {
          from: 'pressreleasecategories',
          as: 'pressReleaseCategory',
          foreignField: '_id',
          localField: 'category',
        },
      },
      {
        $unwind: '$pressReleaseCategory',
      },

      {
        $match: condition,
      },
      {
        $project: {
          title: 1,
          slug: 1,
          description: 1,
          pressFeatureImage: 1,
          metaTitle: 1,
          metaDescriptin: 1,
          metaKeyword: 1,
          createdAt: 1,
          categoryName: '$pressReleaseCategory.categoryName',
        },
      },
      { $sort: sort }, // Use this to sort documents by newest first
      { $skip: parseInt(skip) }, // Always apply 'skip' before 'limit'
      { $limit: parseInt(limit) }, // This is your 'page size'
    ]);
    const totalRecords: Document[] | number | any =
      await PressReleaseModel.aggregate([
        {
          $lookup: {
            from: 'pressreleasecategories',
            as: 'pressReleaseCategory',
            foreignField: '_id',
            localField: 'category',
          },
        },
        {
          $unwind: '$pressReleaseCategory',
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
      message: message.listFetchSuccess.replace(':item', 'Press release'),
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
   VIEW PRESS RELEASE DETAILS
 ------------------------------
 */

/**
 * @api {get} press-release/:id  Press Release details
 * @apiName viewPressRelease
 * @apiGroup Frontend
 * @apiPermission user
 * @apiDescription To fetch a Press Release details
 * @apiParam {String} _id id of the Press Release.
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    message:"Press Release details fetched successfully",
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

const viewPressRelease = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;
    const { id }: string | any = params;
    // const result: Document | null | any = await PressReleaseModel.findOne({
    //   _id: id,
    // });
    // if (result == null) {
    //   return res.status(404).json({
    //     responseCode: 404,
    //     message: message.notFound.replace(':item', 'Data'),
    //     success: true,
    //   });
    // }
    const result: Document[] = await PressReleaseModel.aggregate([
      {
        $match: {
          _id: Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'pressreleasecategories',
          as: 'pressReleaseCategory',
          foreignField: '_id',
          localField: 'category',
        },
      },
      {
        $unwind: '$pressReleaseCategory',
      },

      {
        $project: {
          title: 1,
          slug: 1,
          description: 1,
          pressFeatureImage: 1,
          metaTitle: 1,
          metaDescriptin: 1,
          metaKeyword: 1,
          createdAt: 1,
          categoryName: '$pressReleaseCategory.categoryName',
        },
      },
    ]);
    return res.status(200).json({
      message: message.viewSuccess.replace(':item', 'Press release'),
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

export { getPressRelease, viewPressRelease };
