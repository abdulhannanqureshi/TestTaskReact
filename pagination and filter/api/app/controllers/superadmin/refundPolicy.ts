import { Request, Response } from 'express';
import { RefundPolicyModel } from '../../models';
import { message } from '../../common';
import { Document } from 'mongoose';
import { validationResult } from 'express-validator';
import { ValidationFormatter } from '../../common/formatter';

/**
 ----------------------------------
        GET REFUND POLICY
 ----------------------------------
 */

/**
 * @api {get} refund-policy/  Get Refund Policy
 * @apiName viewRefundPolicy
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch Refund Policy details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  message:"Refund Policy details fetched successfully",
 *   responseCode: 200,
      data: result,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const viewRefundPolicy = async (req: Request, res: Response): Promise<any> => {
  try {
    const result: Document | null | any = await RefundPolicyModel.findOne();
    return res.status(200).json({
      success: true,
      message: message.viewSuccess.replace(':item', 'Refund Policy'),
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
       UPDATE REFUND POLICY
 -------------------------------
 */

/**
 * @api {put} refund-policy/      Update Refund Policy
 * @apiName updateRefundPolicy
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription api for Update Refund Policy
 * @apiParam {String} title title of Refund Policy.
 * @apiParam {String} content content of Refund Policy.
 * @apiParamExample {Object} Request-Example:
   
  {
    "title": "Refund Policy",
    "content": "This is Refund Policy",
  }
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message:"Refund Policy updated successfully",
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
const updateRefundPolicy = async (
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

    const result: Document = await RefundPolicyModel.updateOne(
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
      message: message.updateSuccess.replace(':item', 'Refund Policy'),
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

export { viewRefundPolicy, updateRefundPolicy };
