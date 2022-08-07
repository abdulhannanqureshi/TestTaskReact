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
 * @apiGroup SuperAdmin
 * @apiPermission admin
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
    const result: Document[] = await MarketingModel.find({
      isDeleted: false,
      isActive: true,
    });
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
 * @apiGroup SuperAdmin
 * @apiPermission admin
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
    const result: Document | any = await MarketingModel.findOne({
      _id: id,
      isDeleted: false,
      isActive: true,
    });
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
      message: message.viewSuccess.replace(':item', result.title),
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
     UPDATE MARKET
 --------------------------
 */

/**
 * @api {get} market-content/:id           Update api for a market
 * @apiName updateMarket
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription To Update a market details 
 * @apiParam {String} id id of the market.
 * @apiParam {String} title title of the market.
 * @apiParam {String} content content of the market.
 * {
     "title": "Account",
     "content": "xyz",
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  message:"Market Page Update successfully",
 *   responseCode: 200,
      data: result,
      success: true,
 * }
 * @apiErrorExample {json}  error
 
 *    HTTP/1.1 500 Internal Server Error
 */

const updateMarket = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;
    const { id } = params;
    let { body } = req;
    const market: Document | null | any = await MarketingModel.findOne({
      _id: id,
    });

    body.marketBannerImage = market.marketBannerImage;
    body.blockImage1 = market.blockImage1;
    body.blockImage2 = market.blockImage2;
    body.blockImage3 = market.blockImage3;
    body.blockImage4 = market.blockImage4;
    body.blockImage5 = market.blockImage5;
    body.blockImage6 = market.blockImage6;
    body.blockImage7 = market.blockImage7;
    body.blockImage8 = market.blockImage8;
    body.blockImage9 = market.blockImage9;
    body.blockImage10 = market.blockImage10;

    if (req.files) {
      const files = req.files;
      for (const [key, value] of Object.entries(files)) {
        switch (key) {
          case 'marketBannerImage':
            body.marketBannerImage = `uploads/market/${value[0].filename}`;
            break;
          case 'blockImage1':
            body.blockImage1 = `uploads/market/${value[0].filename}`;

            break;
          case 'blockImage2':
            body.blockImage2 = `uploads/market/${value[0].filename}`;

            break;
          case 'blockImage3':
            body.blockImage3 = `uploads/market/${value[0].filename}`;

            break;
          case 'blockImage4':
            body.blockImage4 = `uploads/market/${value[0].filename}`;
            break;
          case 'blockImage5':
            body.blockImage5 = `uploads/market/${value[0].filename}`;

            break;
          case 'blockImage6':
            body.blockImage6 = `uploads/market/${value[0].filename}`;

            break;
          case 'blockImage7':
            body.blockImage7 = `uploads/market/${value[0].filename}`;

            break;
          case 'blockImage8':
            body.blockImage8 = `uploads/market/${value[0].filename}`;

            break;
          case 'blockImage9':
            body.blockImage9 = `uploads/market/${value[0].filename}`;

            break;
          case 'blockImage10':
            body.blockImage10 = `uploads/market/${value[0].filename}`;

            break;

          default:
            break;
        }
      }
    }

    if (
      body.dropMarketBannerImage === true ||
      body.dropMarketBannerImage === 'true' ||
      body.dropMarketBannerImage == 'true' ||
      body.dropMarketBannerImage == true
    ) {
      body.marketBannerImage = '';
    }
    if (
      body.dropBlockImage1 === true ||
      body.dropBlockImage1 === 'true' ||
      body.dropBlockImage1 == 'true' ||
      body.dropBlockImage1 == true
    ) {
      body.blockImage1 = '';
    }
    if (
      body.dropBlockImage2 === true ||
      body.dropBlockImage2 === 'true' ||
      body.dropBlockImage2 == 'true' ||
      body.dropBlockImage2 == true
    ) {
      body.blockImage2 = '';
    }
    if (
      body.dropBlockImage3 === true ||
      body.dropBlockImage3 === 'true' ||
      body.dropBlockImage3 == 'true' ||
      body.dropBlockImage3 == true
    ) {
      body.blockImage3 = '';
    }
    if (
      body.dropBlockImage4 === true ||
      body.dropBlockImage4 === 'true' ||
      body.dropBlockImage4 == 'true' ||
      body.dropBlockImage4 == true
    ) {
      body.blockImage4 = '';
    }
    if (
      body.dropBlockImage5 === true ||
      body.dropBlockImage5 === 'true' ||
      body.dropBlockImage5 == 'true' ||
      body.dropBlockImage5 == true
    ) {
      body.blockImage5 = '';
    }

    const result: Document = await MarketingModel.updateOne(
      {
        _id: id,
      },
      {
        $set: { ...body },
      }
    );
    return res.status(200).json({
      responseCode: 200,
      message: message.updateSuccess.replace(':item', `${market.title} Page`),
      data: result,
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
export { updateMarket, viewMarket, getMarket };
