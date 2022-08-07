import { Request, Response } from 'express';
import { PrivacyPolicyModel } from '../../models';
import { message } from '../../common';
import { Document } from 'mongoose';
import { validationResult } from 'express-validator';
import { ValidationFormatter } from '../../common/formatter';

/**
 ----------------------------------
        GET PRIVACY POLICY
 ----------------------------------
 */

/**
 * @api {get} privacy-policy/  Get Privacy Policy
 * @apiName viewPrivacyPolicy
 * @apiGroup SuperAdmin
 * @apiPermission admin
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
const viewPrivacyPolicy = async (req: Request, res: Response): Promise<any> => {
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
/**
 -------------------------------
       UPDATE PRIVACY POLICY
 -------------------------------
 */

/**
 * @api {put} privacy-policy/      Update Privacy Policy
 * @apiName updatePrivacyPolicy
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription api for Update Privacy Policy
 * @apiParam {String} title title of Privacy Policy.
 * @apiParam {String} content content of Privacy Policy.
 * @apiParamExample {Object} Request-Example:
   
  {
    "title": "Privacy Policy",
    "content": "This is Privacy Policy",
  }
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message:"Privacy Policy updated successfully",
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
const updatePrivacyPolicy = async (
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

    const result: Document = await PrivacyPolicyModel.updateOne(
      {},
      {
        $set: {
          ...body,
        },
      }
    );

    return res.status(200).json({
      responseCode: 200,
      success: true,
      data: result,
      message: message.updateSuccess.replace(':item', 'Privacy Policy'),
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

export { viewPrivacyPolicy, updatePrivacyPolicy };
