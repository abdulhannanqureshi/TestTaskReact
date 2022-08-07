import { Request, Response } from 'express';
import { BlogModel, BlogCategoryModel } from '../../models';
import { Document, Types } from 'mongoose';
import { message } from '../../common';

/**
 -------------------------
      GET ALL BLOGS
 -------------------------
 */

/**
 * @api {get} blog/  Get blog list
 * @apiName getBlogs
 * @apiGroup Frontend
 * @apiPermission user
 * @apiDescription To fetch blogs details 
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

const getBlogs = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query } = req;
    const searchValue: any = query.searchValue || '';
    const categoryId: any = query.categoryId || '';
    const isActive: any = query.isActive || '';
    const skip: any = query.skip || 0;
    let limit: any = query.limit || 10;
    const sortBy: any = query.sortBy || '';
    let condition: object = {
      isDeleted: false,
      isActive: true,
      'blogCategory.isActive': true,
      'blogCategory.isDeleted': false,
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
    const result: Document[] | any = await BlogModel.aggregate([
      {
        $lookup: {
          from: 'blogcategories',
          as: 'blogCategory',
          foreignField: '_id',
          localField: 'category',
        },
      },
      {
        $unwind: '$blogCategory',
      },

      {
        $match: condition,
      },
      {
        $project: {
          title: 1,
          slug: 1,
          description: 1,
          blogFeatureImage: 1,
          metaTitle: 1,
          metaDescriptin: 1,
          metaKeyword: 1,
          createdAt: 1,
          categoryName: '$blogCategory.categoryName',
        },
      },
      { $sort: sort }, // Use this to sort documents by newest first
      { $skip: parseInt(skip) }, // Always apply 'skip' before 'limit'
      { $limit: parseInt(limit) }, // This is your 'page size'
    ]);
    const totalRecords: Document[] | number | any = await BlogModel.aggregate([
      {
        $lookup: {
          from: 'blogcategories',
          as: 'blogCategory',
          foreignField: '_id',
          localField: 'category',
        },
      },
      {
        $unwind: '$blogCategory',
      },

      {
        $match: condition,
      },

      { $count: 'count' },
    ]);
    return res.status(200).json({
      responseCode: 200,
      message: message.listFetchSuccess.replace(':item', 'Blog'),
      data: result,
      totalRecords:
        totalRecords && totalRecords.length ? totalRecords[0].count : 0,
      success: true,
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
 ---------------------------
      VIEW BLOG DETAILS
 ---------------------------
 */

/**
 * @api {get} blog/:id  Blog details
 * @apiName viewBlog
 * @apiGroup Frontend
 * @apiPermission user
 * @apiDescription To fetch a Blog details
 * @apiParam {String} _id id of the Blog.
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    message:"Blog details fetched successfully",
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

const viewBlog = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;
    const { id }: string | any = params;

    const result: Document[] | any = await BlogModel.aggregate([
      {
        $match: {
          _id: Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'blogcategories',
          as: 'blogCategory',
          foreignField: '_id',
          localField: 'category',
        },
      },
      {
        $unwind: '$blogCategory',
      },

      {
        $project: {
          title: 1,
          slug: 1,
          description: 1,
          blogFeatureImage: 1,
          metaTitle: 1,
          metaDescriptin: 1,
          metaKeyword: 1,
          isActive: 1,
          createdAt: 1,
          categoryName: '$blogCategory.categoryName',
        },
      },
    ]);
    return res.status(200).json({
      message: message.viewSuccess.replace(':item', 'Blog'),
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

export { getBlogs, viewBlog };
