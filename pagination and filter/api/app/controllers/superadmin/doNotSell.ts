import { Request, Response } from 'express';
import { DoNotSellModel } from '../../models';
import { message } from '../../common';
import { Document } from 'mongoose';
import { validationResult } from 'express-validator';
import { ValidationFormatter } from '../../common/formatter';

/**
 ----------------------------------
        GET DO NOT SELL
 ----------------------------------
 */

/**
 * @api {get} do-not-sell/  Get Do Not Sell
 * @apiName viewDoNotSell
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To fetch Do Not Sell details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  message:"Do Not Sell details fetched successfully",
 *   responseCode: 200,
      data: result,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const viewDoNotSell = async (req: Request, res: Response): Promise<any> => {
  try {
    const result: Document | null | any = await DoNotSellModel.findOne();
    return res.status(200).json({
      success: true,
      message: message.viewSuccess.replace(':item', 'Do Not Sell'),
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
       UPDATE DO NOT SELL
 -------------------------------
 */

/**
 * @api {put} do-not-sell/      Update Do Not Sell
 * @apiName updateDoNotSell
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription api for Update Do Not Sell
 * @apiParam {String} title title of Do Not Sell.
 * @apiParam {String} content content of Do Not Sell.
 * @apiParamExample {Object} Request-Example:
   
  {
    "title": "Do Not Sell",
    "content": "This is Do Not Sell",
  }
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message:"Do Not Sell updated successfully",
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
const updateDoNotSell = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { body } = req;

    const result: Document = await DoNotSellModel.updateOne(
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
      message: message.updateSuccess.replace(':item', 'Do Not Sell'),
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

export { viewDoNotSell, updateDoNotSell };
