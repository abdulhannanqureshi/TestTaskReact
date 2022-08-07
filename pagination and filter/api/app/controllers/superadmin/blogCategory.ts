import { Request, Response } from 'express';
import { BlogCategoryModel } from '../../models';
import { message } from '../../common';
import { Document, Types } from 'mongoose';
import { validationResult } from 'express-validator';
import { ValidationFormatter } from '../../common/formatter';

/**
 -----------------------
    ADD BLOG CATEGORY
 -----------------------
 */
/**
 * @api {post} blog-category/  Add Blog category
 * @apiName addBlogCategory
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Add API for Blogs category
 * @apiParam {String} categoryName categoryName of the Blog category.
 * @apiParamExample {Object} Request-Example:
{
     "categoryName": "Books"
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *    responseCode: 200,
      data: result,
      message: 'Blog Category added successfully.',
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 *    HTTP/1.1 500 Internal Server Error
 */
const addBlogCategory = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { body } = req;
    const { categoryName } = body;
    const users: Document | null | any = await BlogCategoryModel.findOne({
      categoryName,
      isDeleted: false,
    });
    if (users) {
      return res.status(400).json({
        code: 400,
        message: message.alreadyExists.replace(':item', 'Category Name'),
        success: false,
      });
    }

    const data: object = {
      categoryName,
    };
    const blogCategoryData: Document = new BlogCategoryModel(data);
    const result: any = await blogCategoryData.save();

    return res.status(200).json({
      responseCode: 200,
      data: result,
      message: message.addedSuccess.replace(':item', 'Blog category'),
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
  GET ALL BLOGS CATEGORY
 -------------------------
 */

/**
 * @api {get} blog-category/  Get Blog Category list
 * @apiName getBlogCategory
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch blogs category details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  message:"Blog Category details fetched successfully",
 *   responseCode: 200,
      data: result,
      totalRecords,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const getBlogCategory = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query } = req;
    const searchValue: any = query.searchValue || '';
    const isActive: any = query.isActive || '';
    let skip: any = query.skip || 0;
    let limit: any = query.limit || 10;
    const sortBy: any = query.sortBy || '';
    let condition: object = {};
    let sort: any = { createdAt: -1 };
    skip = (skip - 1) * limit;
    if (sortBy == 1) {
      sort = {
        categoryName: 1,
      };
    }
    if (limit === 'all') {
      // Sort user name by A-Z
      limit = 0;
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

    const totalRecords: number = await BlogCategoryModel.countDocuments({
      ...condition,
      isDeleted: false,
    });
    const result: Document[] = await BlogCategoryModel.find({
      ...condition,
      isDeleted: false,
    })
      .sort(sort)
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    return res.status(200).json({
      responseCode: 200,
      message: message.listFetchSuccess.replace(':item', 'Blog category'),
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
 -----------------------
  UPDATE BLOG CATEGORY
 -----------------------
 */
/**
 * @api {put} blog-category/:id  Update Blog category
 * @apiName updateBlogCategory
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Update API for Blog Category
 * @apiParam {String} categoryName categoryName of the Blog.
 * @apiParam {String} id id of the Blog Category.
 * @apiParamExample {Object} Request-Example:
{
     "categoryName": "library"
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   responseCode: 200,
      data: result,
      message: 'Blog category updated successfully.',
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
       message:'Category name already exist',
      success: false,
 * }
 *    HTTP/1.1 500 Internal Server Error
 */

const updateBlogCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
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
    const user: Document[] = await BlogCategoryModel.find({
      categoryName: body.categoryName,
      isDeleted: false,
      _id: { $ne: id },
    });
    if (user.length > 0) {
      return res.status(400).json({
        message: message.alreadyExists.replace(':item', 'Category Name'),
        success: false,
      });
    }

    const result: Document = await BlogCategoryModel.update(
      {
        _id: id,
      },
      {
        $set: {
          ...body,
        },
      }
    );

    return res.status(200).json({
      responseCode: 200,
      data: result,
      message: message.updateSuccess.replace(':item', 'Blog category details'),
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
 --------------------------------
   UPDATE BLOG CATEGORY STATUS
 --------------------------------
 */
/**
 * @api {put} /blog-category/update-status/:id  Update Blog category status
 * @apiName updateStatusBlogCategory
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription  API for Update Blog Category Status
 * @apiParam {Boolean} isActive isActive status of the Blog Category.
 * @apiParam {String} id id of the Blog Category.
 * @apiParamExample {Object} Request-Example:
{
  isActive: true
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:'Blog Category activated successfully!',
 *   responseCode: 200,
 *   data: result,
 *  success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const updateStatusBlogCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body, params } = req;
    const { isActive } = body;
    const { id }: string | any = params;
    const result: Document = await BlogCategoryModel.update(
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
        ? message.activeSuccess.replace(':item', 'Blog category')
        : message.deactivatedSuccess.replace(':item', 'Blog category');
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
    DELETE BLOG CATEGORY
 ---------------------------
 */

/**
 * @api {delete} blog-category/:id     Delete Blog category
 * @apiName deleteBlogCategory
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To Delete a Blog Category 
 * @apiParam {String} _id id of the Blog Category.
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    responseCode: 200,
      message: 'Blog Category deleted',
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

const deleteBlogCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { params } = req;

    const { id }: string | any = params;
    const result: Document | null | any = await BlogCategoryModel.findOne({
      _id: id,
    });
    if (result == null) {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'Data'),
        success: true,
      });
    }
    await BlogCategoryModel.updateOne(
      { _id: id },
      {
        $set: {
          isDeleted: true,
        },
      }
    );
    return res.status(200).json({
      responseCode: 200,
      message: message.deletedSuccess.replace(':item', 'Blog category'),
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
   GET A BLOGS CATEGORY
 -------------------------
 */

/**
 * @api {get} blog-category/:id  Get Blog Category view
 * @apiName viewBlogCategory
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To view a blogs category details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  message:"Blog Category details fetched successfully",
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

const viewBlogCategory = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;
    const { id }: string | any = params;
    const result: Document | null | any = await BlogCategoryModel.findOne({
      _id: id,
    });
    if (result == null) {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'Data'),
        success: true,
      });
    }
    return res.status(200).json({
      message: message.viewSuccess.replace(':item', 'Blog category'),
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

export {
  addBlogCategory,
  getBlogCategory,
  updateBlogCategory,
  updateStatusBlogCategory,
  deleteBlogCategory,
  viewBlogCategory,
};
