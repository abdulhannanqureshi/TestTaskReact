import { Request, Response } from 'express';
import { TermsAndConditionModel } from '../../models';
import { message } from '../../common';
import { Document } from 'mongoose';
/**
 ----------------------------------
        GET TERMS AND CONDITION
 ----------------------------------
 */

/**
 * @api {get} terms-and-condition/  Get Terms And Condition
 * @apiName getTermsAndCondition
 * @apiGroup Frontend
 * @apiPermission none
 * @apiDescription To fetch Terms And Condition details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  message:"Terms And Condition details fetched successfully",
 *   responseCode: 200,
      data: result,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const getTermsAndCondition = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const result: Document | null | any =
      await TermsAndConditionModel.findOne();
    return res.status(200).json({
      success: true,
      message: message.viewSuccess.replace(':item', 'Terms And Condition'),
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
export { getTermsAndCondition };
