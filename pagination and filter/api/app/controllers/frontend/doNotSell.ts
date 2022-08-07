import { Request, Response } from 'express';
import { DoNotSellModel } from '../../models';
import { message } from '../../common';
import { Document } from 'mongoose';
/**
 ----------------------------------
        GET DO NOT SELL
 ----------------------------------
 */

/**
 * @api {get} do-not-sell/  Get Do Not Sell
 * @apiName getDoNotSell
 * @apiGroup Frontend
 * @apiPermission none
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
const getDoNotSell = async (req: Request, res: Response): Promise<any> => {
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
export { getDoNotSell };
