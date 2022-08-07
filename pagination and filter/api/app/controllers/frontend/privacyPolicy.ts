import { Request, Response } from 'express';
import { PrivacyPolicyModel } from '../../models';
import { message } from '../../common';
import { Document } from 'mongoose';
/**
 ----------------------------------
        GET PRIVACY POLICY
 ----------------------------------
 */

/**
 * @api {get} privacy-policy/  Get Privacy Policy
 * @apiName getPrivacyPolicy
 * @apiGroup Frontend
 * @apiPermission none
 * @apiDescription To fetch Privacy Policy details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  message:"Privacy Policy details fetched successfully",
 *   responseCode: 200,
      data: result,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const getPrivacyPolicy = async (req: Request, res: Response): Promise<any> => {
  try {
    const result: Document | null | any = await PrivacyPolicyModel.findOne();
    return res.status(200).json({
      success: true,
      message: message.viewSuccess.replace(':item', 'Privacy Policy'),
      responseCode: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error && error.message
          ? error.message
          : message.unexpectedError,
    });
  }
};
export { getPrivacyPolicy };
