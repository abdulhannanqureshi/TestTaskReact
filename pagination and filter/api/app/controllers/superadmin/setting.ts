import { Request, Response } from 'express';
import { SettingModel } from '../../models';
import { message } from '../../common';
import { Document } from 'mongoose';
import { validationResult } from 'express-validator';
import { ValidationFormatter } from '../../common/formatter';

/**
 ----------------------------------
          GET SETTING
 ----------------------------------
 */

/**
 * @api {get} setting/  Get Setting
 * @apiName viewSetting
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch Setting details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  message:"Setting details fetched successfully",
 *   responseCode: 200,
      data: result,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */

const viewSetting = async (req: Request, res: Response): Promise<any> => {
  try {
    const result: Document | null | any = await SettingModel.findOne();
    return res.status(200).json({
      message: message.viewSuccess.replace(':item', 'Setting'),
      responseCode: 200,
      data: result,
      success: true,
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
 -------------------------------
       UPDATE SETTING
 -------------------------------
 */

/**
 * @api {put} setting/      Update Setting
 * @apiName updateSetting
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription api for Update Setting
 * @apiParam {String} courseDuration Duration of course.
 * @apiParam {String} facebook url of facebook.
 * @apiParam {String} twitter url of twitter.
 * @apiParam {String} linkedin url of linkedin.
 * @apiParam {String} pinterest url of pinterest.
 * @apiParam {String} phone phone number of org.
 * @apiParam {String} email email of org.
 * @apiParam {String} headOfficeAddress Head Office Address of org.
 * @apiParamExample {Object} Request-Example:
   
  {
    "courseDuration": "30",
    "certificateAmount":"300",
    "facebook": "https://www.facebook.com/coinifide/",
    "twitter": "https://twitter.com/coinifidehq",
    "linkedin": "https://www.linkedin.com/",
    "pinterest": "https://in.pinterest.com/",
    "phone": "+39 659-657-0133",
    "email": "hi@maccarianagency.com",
    "headOfficeAddress": "Via E. Golla 4"
  }
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message:"Setting updated successfully",
 *   responseCode: 200,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 *    HTTP/1.1 500 Internal Server Error
 */
const updateSetting = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { body } = req;

    const result: Document = await SettingModel.update(
      {},
      {
        $set: {
          ...body,
        },
      }
    );

    return res.status(200).json({
      responseCode: 200,
      data: result,
      message: message.updateSuccess.replace(':item', 'Setting'),
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

export { viewSetting, updateSetting };
