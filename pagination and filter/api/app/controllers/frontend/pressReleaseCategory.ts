import { Request, Response } from 'express';
import { PressReleaseCategoryModel } from '../../models';
import { message } from '../../common';
import { Document, Types } from 'mongoose';

/**
 ----------------------------------
   GET ALL PRESS RELEASE CATEGORY
 ----------------------------------
 */

/**
 * @api {get} press-release-category/  Get Press Release Category list
 * @apiName getPressReleaseCategory
 * @apiGroup Frontend
 * @apiPermission user
 * @apiDescription To fetch  Press Release Category details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  message:"Press Release Category details fetched successfully",
 *   responseCode: 200,
      data: result,
      totalRecords,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const getPressReleaseCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { query } = req;
    const searchValue: any = query.searchValue || '';
    const isActive: any = query.isActive || '';
    const skip: any = query.skip || 0;
    let limit: any = query.limit || 10;
    const sortBy: any = query.sortBy || '';
    let condition: object = {};
    let sort: any = { createdAt: -1 };

    if (sortBy == 1) {
      sort = {
        categoryName: 1,
      };
    }
    if (limit === 'all') {
      // Sort user name by A-Z
      limit = '0';
    }
    if (searchValue) {
      condition = {
        $or: [
          {
            categoryName: {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
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

    const totalRecords: number = await PressReleaseCategoryModel.countDocuments(
      {
        ...condition,
        isDeleted: false,
        isActive: true,
      }
    );
    const result: Document[] = await PressReleaseCategoryModel.find({
      ...condition,
      isDeleted: false,
      isActive: true,
    })
      .sort(sort)
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    return res.status(200).json({
      responseCode: 200,
      message: message.listFetchSuccess.replace(
        ':item',
        'Press release category'
      ),
      data: result,
      totalRecords,
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
   GET A PRESS RELEASE CATEGORY
 ---------------------------------
 */

/**
 * @api {get} press-release-category/:id  Get Press Release Category view
 * @apiName viewPressReleaseCategory
 * @apiGroup Frontend
 * @apiPermission user
 * @apiDescription To view a Press Release Category details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  message:"Press Release Category details fetched successfully",
 *   responseCode: 200,
      data: result,
      success: true,
 * }
 * @apiErrorExample {json}  list error
 * * HTTP/1.1 404 NotFound
 * {
 *    message: "Data not found.",
 *  responseCode: 404,
 *  success: false
 * }
 *    HTTP/1.1 500 Internal Server Error
 */

const viewPressReleaseCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { params } = req;
    const { id }: string | any = params;
    const result: Document | null | any =
      await PressReleaseCategoryModel.findOne({ _id: id });
    if (result == null) {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'Data'),
        success: true,
      });
    }
    return res.status(200).json({
      message: message.viewSuccess.replace(':item', 'Press release category'),
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

export { getPressReleaseCategory, viewPressReleaseCategory };
