import { Request, Response } from 'express';
import { cmsModel } from '../../models';
import { Document } from 'mongoose';
import { message } from '../../common';

/**
 --------------------------
        GET CMS
 --------------------------
 */

/**
 * @api {get} cms/             Get api for cms
 * @apiName getCms
 * @apiGroup Frontend
 * @apiPermission none
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
    const result: Document[] = await cmsModel.find();
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
 * @apiGroup Frontend
 * @apiPermission none
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
    const result: Document[] = await cmsModel.findOne({ _id: id });
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
      message: message.viewSuccess.replace(':item', 'Cms Page'),
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
export { viewCms, getCms };
