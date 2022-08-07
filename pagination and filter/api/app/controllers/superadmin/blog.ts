import { Request, Response } from 'express';
import moment from 'moment';
import { BlogModel, BlogCategoryModel } from '../../models';
import { Document, Types } from 'mongoose';
import { validationResult } from 'express-validator';
import { ValidationFormatter } from '../../common/formatter';
import { message } from '../../common';
import Mongoose from 'mongoose';
/**
 -----------------------
       ADD BLOG 
 -----------------------
 */
/**
 * @api {post} blog/  Add Blog
 * @apiName addBlog
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Add API for Blogs
 * @apiParam {String} category category of the Blog.
 * @apiParam {String} title title of the Blog.
 * @apiParam {String} description description of the Blog.
 * @apiParam {String} metaTitle metaTitle of the Blog.
 * @apiParam {String} metaDescriptin metaDescriptin of the Blog.
 * @apiParam {String} metaKeyword metaKeyword of the Blog.
 * @apiParamExample {Object} Request-Example:
{
    "category": "612df7b67316b6623761c0e8",
    "title": "A book.",
    "description": "A book is good ",
    "metaTitle": "",
    "metaDescriptin": "",
    "metaKeyword": ""
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *    responseCode: 200,
      data: result,
      message: 'Blog added successfully.',
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 *  HTTP/1.1 400 blogCategory
 * {
 *     code: 400,
        message: "Category not found",
        success: false,
 * }
 *    HTTP/1.1 500 Internal Server Error
 */
const addBlog = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { body, file = { filename: '' } } = req;
    const {
      category,
      title,
      description,
      metaTitle,
      metaDescriptin,
      metaKeyword,
    } = body;

    const blogCategory: Document | null | any = await BlogCategoryModel.findOne(
      {
        _id: category,
        isDeleted: false,
      }
    );
    if (!blogCategory) {
      return res.status(400).json({
        code: 400,
        message: message.notFound.replace(':item', 'Category'),
        success: false,
      });
    }

    const data: object = {
      category,
      title,
      description,
      metaTitle,
      metaDescriptin,
      metaKeyword,
      blogFeatureImage: file ? `uploads/blogs/${file.filename}` : '',
    };

    const blogData: Document = new BlogModel(data);
    const result: any = await blogData.save();

    return res.status(200).json({
      responseCode: 200,
      data: result,
      message: message.addedSuccess.replace(':item', 'Blog'),
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
      GET ALL BLOGS
 -------------------------
 */

/**
 * @api {get} blog/  Get blog list
 * @apiName getBlogs
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch blogs details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message: Blog list fetched successfully
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
    const isActive: any = query.isActive || '';
    let skip: any = query.skip || 0;
    let limit: any = query.limit || 10;
    const sortBy: any = query.sortBy || '';
    const fromDate: any = query.fromDate || '';
    const toDate: any = query.toDate || '';
    let condition: object = { isDeleted: false };
    let sort: any = { createdAt: -1 };
    skip = (skip - 1) * limit;
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
            'blogCategory.categoryName': {
              $regex: new RegExp(searchValue.trim(), 'i'),
            },
          },
          {
            title: {
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
          isActive: 1,
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
    // const result: Document[] = await BlogModel.find({
    //   ...condition,
    //   isDeleted: false,
    // })
    //   .sort(sort)
    //   .skip(parseInt(skip))
    //   .limit(parseInt(limit));
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
      VIEW BLOG DETAILS
 ---------------------------
 */

/**
 * @api {get} blog/:id  Blog details
 * @apiName viewBlog
 * @apiGroup SuperAdmin
 * @apiPermission admin
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
    const result: Document | null | any = await BlogModel.findOne({ _id: id });
    if (result == null) {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'Data'),
        success: true,
      });
    }
    return res.status(200).json({
      message: message.viewSuccess.replace(':item', 'Blog'),
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
 -----------------------
       UPDATE BLOG 
 -----------------------
 */
/**
 * @api {put} blog/:id  Update Blog
 * @apiName updateBlog
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Update API for Blog
 * @apiParam {String} category category of the Blog.
 * @apiParam {String} title title of the Blog.
 * @apiParam {String} description description of the Blog.
 * @apiParam {String} metaTitle metaTitle of the Blog.
 * @apiParam {String} metaDescriptin metaDescriptin of the Blog.
 * @apiParam {String} metaKeyword metaKeyword of the Blog.
 * @apiParamExample {Object} Request-Example:
{
    "category": "612df7b67316b6623761c0e8",
    "title": "A book.",
    "description": "A book is great ",
    "metaTitle": "",
    "metaDescriptin": "",
    "metaKeyword": ""
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   responseCode: 200,
      data: result,
      message: 'Blog details updated successfully.',
      success: true,
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 *  HTTP/1.1 400 blogCategory
 * {
 *     code: 400,
       message: "Category not found",
      success: false,
 * }
 *    HTTP/1.1 500 Internal Server Error
 */

const updateBlog = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { body, params } = req;
    const { id }: string | any = params;
    const {
      category,
      title,
      description,
      metaTitle,
      metaDescription,
      metaKeyword,
      dropBlogFeatureImage,
    } = body;
    const blogCategory: Document | null | any = await BlogCategoryModel.findOne(
      {
        _id: body.category,
        isDeleted: false,
      }
    );
    if (!blogCategory) {
      return res.status(400).json({
        code: 400,
        message: message.notFound.replace(':item', 'Category'),
        success: false,
      });
    }
    const blog: Document | null | any = await BlogModel.findOne({
      _id: id,
      isDeleted: false,
    });

    let blogFeatureImage: String = blog.blogFeatureImage;

    if (req.file) {
      const file = req.file;
      blogFeatureImage = `uploads/blogs/${file.filename}`;
    }

    if (dropBlogFeatureImage === 'true' || dropBlogFeatureImage === true) {
      blogFeatureImage = '';
    }

    const result: Document = await BlogModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          category,
          title,
          description,
          metaTitle,
          metaDescription,
          metaKeyword,
          blogFeatureImage,
        },
      }
    );

    return res.status(200).json({
      responseCode: 200,
      data: result,
      message: message.updateSuccess.replace(':item', 'Blog Details'),
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
 -----------------------
    UPDATE BLOG STATUS
 -----------------------
 */
/**
 * @api {put} /blog/update-status/:id  Update Blog status
 * @apiName updateBlogStatus
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription  API for Update Blog Status
 * @apiParam {Boolean} isActive isActive status of the Blog.
 * @apiParam {String} id id of the Blog.
 * @apiParamExample {Object} Request-Example:
{
  isActive: true
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:'Blog activated successfully!',
 *   responseCode: 200,
 *   data: result,
 *  success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const updateBlogStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body, params } = req;
    const { isActive } = body;
    const { id }: string | any = params;
    const result: Document = await BlogModel.updateOne(
      {
        _id: { $in: id },
      },
      {
        $set: {
          isActive: isActive,
        },
      }
    );
    const text: string =
      isActive === true
        ? message.activeSuccess.replace(':item', 'Blog')
        : message.deactivatedSuccess.replace(':item', 'Blog');
    return res.status(200).json({
      responseCode: 200,
      data: result,
      message: text,
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
 ---------------------------
        DELETE BLOG 
 ---------------------------
 */

/**
 * @api {delete} blog/:id     Delete Blog 
 * @apiName deleteBlog
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To Delete a Blog  
 * @apiParam {String} _id id of the Blog.
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    responseCode: 200,
      message: 'Blog deleted',
      success: true,
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
const deleteBlog = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;

    const { id }: string | any = params;
    const result: Document | null | any = await BlogModel.findOne({ _id: id });
    if (result === null) {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'Data'),
        success: true,
      });
    }
    // await BlogModel.deleteOne({ _id: id })
    await BlogModel.updateOne(
      { _id: id },
      {
        $set: {
          isDeleted: true,
        },
      }
    );
    return res.status(200).json({
      responseCode: 200,
      message: message.deletedSuccess.replace(':item', 'Blog'),
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
 -------------------------------
        BLOG BULK ACTION
 -------------------------------
 */

/**
 * @api {put} blog/bulk-action      Blog Bulk Action
 * @apiName blogBulkAction
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To Perform bulk action on blogs
 * @apiParam {String} ids id of the Blogs.
 * @apiParam {String} type type of action.
 * @apiParamExample {Object} Request-Example:
   {
  ids: ["612df7b67316b6623761c0e4",'612df7b67316b6623761c0e8],
  type:'Delete',

    }
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message:"Blog deleted successfully",
 *   responseCode: 200,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const blogBulkAction = async (req: Request, res: Response): Promise<any> => {
  try {
    const { ids, type } = req.body;
    let updateData: any = {};
    let msg = '';
    if (type === 'Delete') {
      msg = 'Blog deleted successfully';
      updateData.isDeleted = true;
    }
    if (type === 'Active') {
      msg = 'Blog activated successfully';
      updateData.isActive = true;
    }
    if (type === 'Deactive') {
      msg = 'Blog deactivated successfully';
      updateData.isActive = false;
    }

    await BlogModel.updateMany(
      {
        _id: {
          $in: ids.map(function (value: any) {
            return Mongoose.Types.ObjectId(value);
          }),
        },
      },
      {
        $set: updateData,
      }
    );

    return res.status(200).json({
      message: msg,
      success: true,
      responseCode: 200,
    });
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
export {
  addBlog,
  getBlogs,
  viewBlog,
  updateBlog,
  updateBlogStatus,
  deleteBlog,
  blogBulkAction,
};
