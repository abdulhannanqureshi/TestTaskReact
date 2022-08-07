import { Request, Response } from 'express';
import { SettingModel } from '../../models';
import { message } from '../../common';
import { Document } from 'mongoose';
/**
 ----------------------------------
          GET SETTING
 ----------------------------------
 */

/**
 * @api {get} setting/  Get Setting
 * @apiName getSetting
 * @apiGroup Frontend
 * @apiPermission none
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

const getSetting = async (req: Request, res: Response): Promise<any> => {
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
export { getSetting };
