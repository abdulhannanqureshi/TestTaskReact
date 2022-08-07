import { Request, Response } from 'express';
import { TermsAndConditionModel } from '../../models';
import { message } from '../../common';
import { Document } from 'mongoose';
import { validationResult } from 'express-validator';
import { ValidationFormatter } from '../../common/formatter';

/**
 ----------------------------------
      GET TERMS AND CONDITION
 ----------------------------------
 */

/**
 * @api {get} terms-and-condition/  Get Terms And Condition
 * @apiName viewTermsAndCondition
 * @apiGroup SuperAdmin
 * @apiPermission admin
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
const viewTermsAndCondition = async (
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
/**
 -------------------------------
   UPDATE TERMS AND CONDITION
 -------------------------------
 */

/**
 * @api {put} terms-and-condition/      Update Terms And Condition
 * @apiName updateTermsAndCondition
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription api for Update Terms And Condition
 * @apiParam {String} title title of Terms And Condition
 * @apiParam {String} content content of Terms And Condition
 * @apiParamExample {Object} Request-Example:
   
  {
    "title": "Terms And Condition",
    "content": "This is Terms And Condition",
  }
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message:"Terms And Condition updated successfully",
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
const updateTermsAndCondition = async (
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

    const result: Document = await TermsAndConditionModel.updateOne(
      {},
      {
        $set: {
          ...body,
        },
      }
    );

    return res.status(200).json({
      message: message.updateSuccess.replace(':item', 'Terms And Condition'),
      responseCode: 200,
      success: true,
      data: result,
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

export { viewTermsAndCondition, updateTermsAndCondition };
