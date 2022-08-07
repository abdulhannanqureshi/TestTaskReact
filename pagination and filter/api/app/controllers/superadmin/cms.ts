import { Request, Response } from 'express';
import { cmsModel } from '../../models';
import { Document } from 'mongoose';
import path from 'path';
import { FrontImageUploadPath } from '../../config';
import { message } from '../../common';

/**
 --------------------------
        GET CMS
 --------------------------
 */

/**
 * @api {get} cms/             Get api for cms
 * @apiName getCms
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch cms details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  message:"Cms Pages details fetched successfully",
 *   responseCode: 200,
      data: result,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const getCms = async (req: Request, res: Response): Promise<any> => {
  try {
    const result: Document[] = await cmsModel.find({
      isDeleted: false,
      isActive: true,
    });
    return res.status(200).json({
      responseCode: 200,
      data: result,
      message: message.listFetchSuccess.replace(':item', 'Cms Pages'),
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
 --------------------------
        GET A CMS
 --------------------------
 */

/**
 * @api {get} cms/:id           Get api for a cms
 * @apiName viewCms
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch a cms details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  message:"Cms Page details fetched successfully",
 *   responseCode: 200,
      data: result,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *  HTTP/1.1 404 NotFound
 * {
 *    message: "Data not found.",
 *  responseCode: 404,
 *  success: false
 * }
 *    HTTP/1.1 500 Internal Server Error
 */

const viewCms = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;
    const { id } = params;
    const result: Document | any = await cmsModel.findOne({
      _id: id,
      isDeleted: false,
      isActive: true,
    });
    if (!result) {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'Data'),
        success: true,
      });
    }
    return res.status(200).json({
      responseCode: 200,
      data: result,
      message: message.viewSuccess.replace(':item', result.pageName),
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
 --------------------------
        UPDATE CMS
 --------------------------
 */

/**
 * @api {get} cms/:id           Update api for a cms
 * @apiName updateCms
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To Update a cms details 
 * @apiParam {String} id id of the cms.
 * @apiParam {String} title title of the cms.
 * @apiParam {String} content content of the cms.
 * {
     "title": "Account",
     "content": "xyz",
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  message:"Cms Page Update successfully",
 *   responseCode: 200,
      data: result,
      success: true,
 * }
 * @apiErrorExample {json}  error
 
 *    HTTP/1.1 500 Internal Server Error
 */

const updateCms = async (req: Request, res: Response): Promise<any> => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(422).json({
  //     message: ValidationFormatter(errors.mapped()),
  //     success: false,
  //   });
  // }
  try {
    const { body, params } = req;
    const { id } = params;
    const data: Document[] | any = await cmsModel.findOne({ _id: id });
    if (!data) {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'Data'),
        success: true,
      });
    }
    const result: Document = await cmsModel.updateOne(
      {
        _id: id,
      },
      {
        $set: { ...body },
      }
    );
    return res.status(200).json({
      responseCode: 200,
      message: message.updateSuccess.replace(':item', data.pageName),
      data: result,
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
export { updateCms, viewCms, getCms };
