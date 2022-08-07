import { Request, Response } from 'express';
import { PressReleaseCategoryModel } from '../../models';
import { message } from '../../common';
import { Document, Types } from 'mongoose';
import { validationResult } from 'express-validator';
import { ValidationFormatter } from '../../common/formatter';

/**
 ------------------------------
    ADD PRESS RELEASE CATEGORY
 ------------------------------
 */
/**
 * @api {post} press-release-category/  Add Press Release Category
 * @apiName addPressReleaseCategory
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Add API for Press Release Category
 * @apiParam {String} categoryName categoryName of the Press Release Category.
 * @apiParamExample {Object} Request-Example:
{
     "categoryName": "Books"
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *    responseCode: 200,
      data: result,
      message: 'Press release category added successfully.',
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 *    HTTP/1.1 500 Internal Server Error
 */
const addPressReleaseCategory = async (
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
    const { body } = req;
    const { categoryName } = body;
    const users: Document | null | any =
      await PressReleaseCategoryModel.findOne({
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
    const pR_CategoryData: Document = new PressReleaseCategoryModel(data);
    const result: any = await pR_CategoryData.save();

    return res.status(200).json({
      message: message.addedSuccess.replace(':item', 'Press release category'),
      responseCode: 200,
      data: result,
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
 ----------------------------------
   GET ALL PRESS RELEASE CATEGORY
 ----------------------------------
 */

/**
 * @api {get} press-release-category/  Get Press Release Category list
 * @apiName getPressReleaseCategory
 * @apiGroup SuperAdmin
 * @apiPermission admin
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
    let skip: any = query.skip || 0;
    let limit: any = query.limit || 10;
    const sortBy: any = query.sortBy || '';
    let condition: object = {};
    let sort: any = { createdAt: -1 };
    skip = (skip - 1) * limit;
    if (limit === 'all') {
      // Sort user name by A-Z
      limit = 0;
    }
    if (sortBy == 1) {
      sort = {
        categoryName: 1,
      };
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
      }
    );
    const result: Document[] = await PressReleaseCategoryModel.find({
      ...condition,
      isDeleted: false,
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
 ----------------------------------------
    UPDATE PRESS RELEASE CATEGORY
 ----------------------------------------
 */
/**
 * @api {put} press-release-category/:id  Update Press Release Category
 * @apiName updatePressReleaseCategory
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Update API for Press Release Category
 * @apiParam {String} categoryName categoryName of the press release.
 * @apiParam {String} id id of the Press Release Category.
 * @apiParamExample {Object} Request-Example:
{
     "categoryName": "library"
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   responseCode: 200,
      data: result,
      message: 'Press Release Category updated successfully.',
      success: true,
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 *  HTTP/1.1 400 alreadyExist
 * {
       message:'Category name already exist',
      success: false,
 * }
 *    HTTP/1.1 500 Internal Server Error
 */

const updatePressReleaseCategory = async (
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
    const user: Document[] = await PressReleaseCategoryModel.find({
      categoryName: body.categoryName,
      isDeleted: false,
      _id: { $ne: id },
    });
    if (user.length > 0) {
      return res.status(400).json({
        message: message.alreadyExists.replace(':item', 'Category name'),
        success: false,
      });
    }

    const result: Document = await PressReleaseCategoryModel.updateOne(
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
      message: message.updateSuccess.replace(
        ':item',
        'Press release category details'
      ),
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
 -------------------------------------------
    UPDATE PRESS RELEASE CATEGORY STATUS
 -------------------------------------------
 */
/**
 * @api {put} /press-release-category/update-status/:id  Update Press Release Category status
 * @apiName updatePressReleaseCategoryStatus
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription  API for Update Press Release Category Status
 * @apiParam {Boolean} isActive isActive status of the Press Release Category.
 * @apiParam {String} id id of the Press Release Category.
 * @apiParamExample {Object} Request-Example:
{
  isActive: true
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:'Press Release Category activated successfully!',
 *   responseCode: 200,
 *   data: result,
 *  success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const updatePressReleaseCategoryStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body, params } = req;
    const { isActive } = body;
    const { id }: string | any = params;
    const result: Document = await PressReleaseCategoryModel.updateOne(
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
        ? message.activeSuccess.replace(':item', 'Press release category')
        : message.deactivatedSuccess.replace(':item', 'Press release category');
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
 -----------------------------
 DELETE PRESS RELEASE CATEGORY
 -----------------------------
 */

/**
 * @api {delete} press-release-category/:id    Delete Press Release Category
 * @apiName deletePressReleaseCategory
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To Delete a Press Release Category 
 * @apiParam {String} _id id of the Press Release Category.
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    responseCode: 200,
      message: 'Press Release Category deleted',
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

const deletePressReleaseCategory = async (
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
    await PressReleaseCategoryModel.updateOne(
      { _id: id },
      {
        $set: {
          isDeleted: true,
        },
      }
    );
    return res.status(200).json({
      responseCode: 200,
      message: message.deletedSuccess.replace(
        ':item',
        'Press release category'
      ),
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
 * @apiGroup SuperAdmin
 * @apiPermission admin
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

export {
  addPressReleaseCategory,
  getPressReleaseCategory,
  updatePressReleaseCategory,
  updatePressReleaseCategoryStatus,
  deletePressReleaseCategory,
  viewPressReleaseCategory,
};
