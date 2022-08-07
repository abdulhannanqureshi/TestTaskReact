import { Request, Response } from 'express';
const mailChimp: any = require('@mailchimp/mailchimp_marketing');
import { ValidationFormatter } from '../../common';
import { message } from '../../common';
const { validationResult } = require('express-validator/check');

/**
 -----------------------
    ADD NEWS LETTER
 -----------------------
 */
/**
 * @api {post} news-letter/  Add News Letter
 * @apiName addNewsLetter
 * @apiGroup Frontend
 * @apiPermission none
 * @apiDescription  API for Add News Letter
 * @apiParam {String} email Email of the User.
 * @apiParamExample {Object} Request-Example:
{
  
    "email": "chandu@mailinator.com",
 
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message:'News Letter added successfully.',
 *   responseCode: 200,
 *   data: result,
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 *    HTTP/1.1 500 Internal Server Error
 */
const addNewsLetter = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }

  try {
    const { body } = req;
    const { email } = body;

    mailChimp.setConfig({
      apiKey: process.env.MAILCHIMP_KEY,
      server: process.env.MAILCHIMP_SERVER,
    });
    const response: any = await mailChimp.lists.getAllLists();
    let listId: any = [];
    if (response) {
      for (const iterator of response.lists) {
        await listId.push(iterator.id.toString());
      }
    } //end of

    const mailChimpUser: any = await mailChimp.lists.addListMember(listId[0], {
      email_address: email,
      status: 'subscribed',
      email_type: 'html',
    });
    

    return res.status(200).json({
      message: 'NewsLetter Subscribed Successfully',
      success: true,
      responseCode: 200,
    });
  } catch (error) {
    //  console.log(error);

    let err: any = error.response.res.text;
    let msg: any = message.unexpectedError;
    err = JSON.parse(err);

    if (err.title === 'Member Exists') {
      msg = 'You Have already Subscribed to the NewsLetter';
    }
    res.status(500).json({
      message: msg,
      success: false,
    });
  }
};

export { addNewsLetter };
