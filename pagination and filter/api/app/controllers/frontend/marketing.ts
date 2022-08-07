import { Request, Response } from 'express';
import { MarketingModel } from '../../models';
import { Document } from 'mongoose';
import path from 'path';
import { FrontImageUploadPath } from '../../config';
import { message } from '../../common';

/**
 --------------------------
   GET MARKET CONTENT
 --------------------------
 */

/**
 * @api {get} market-content/             Get api for market
 * @apiName getMarket
 * @apiGroup Frontend
 * @apiPermission none
 * @apiDescription To fetch market details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  message:"Market Pages details fetched successfully",
 *   responseCode: 200,
      data: result,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const getMarket = async (req: Request, res: Response): Promise<any> => {
  try {
    const result: Document[] = await MarketingModel.find();
    return res.status(200).json({
      responseCode: 200,
      data: result,
      message: message.listFetchSuccess.replace(':item', 'Market Pages'),
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message ? error.message : message.unexpectedError,
      success: false,
    });
  }
};
/**
 --------------------------
        GET A MARKET
 --------------------------
 */

/**
 * @api {get} market-content/:id           Get api for a market
 * @apiName viewMarket
 * @apiGroup Frontend
 * @apiPermission none
 * @apiDescription To fetch a market details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  message:"Market Page details fetched successfully",
 *   responseCode: 200,
      data: result,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *  HTTP/1.1 404 NotFound
 * {
 *    message: "Data not found.",
 *  responseCode: 404,
 *  success: false
 * }
 *    HTTP/1.1 500 Internal Server Error
 */

const viewMarket = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;
    const { id } = params;
    const result: Document[] = await MarketingModel.findOne({ _id: id });
    if (!result) {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'Data'),
        success: true,
      });
    }
    return res.status(200).json({
      responseCode: 200,
      data: result,
      message: message.viewSuccess.replace(':item', 'Market Page'),
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message ? error.message : message.unexpectedError,
      success: false,
    });
  }
};

export { viewMarket, getMarket };
