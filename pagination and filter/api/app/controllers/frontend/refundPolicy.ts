import { Request, Response } from 'express';
import { RefundPolicyModel } from '../../models';
import { message } from '../../common';
import { Document } from 'mongoose';
/**
 ----------------------------------
        GET REFUND POLICY
 ----------------------------------
 */

/**
 * @api {get} refund-policy/  Get Refund Policy
 * @apiName getRefundPolicy
 * @apiGroup Frontend
 * @apiPermission none
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
const getRefundPolicy = async (req: Request, res: Response): Promise<any> => {
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
export { getRefundPolicy };
