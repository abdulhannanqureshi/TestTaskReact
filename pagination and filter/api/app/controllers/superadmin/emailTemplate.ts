import { Request, Response } from 'express';
const { validationResult } = require('express-validator/check');
import { message, ValidationFormatter } from '../../common';
import { EmailTemplateModel } from '../../models';
import { Document } from 'mongoose';

// Add Template
const addTemplate = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { body, currentUser } = req;
    const { templateName, subject, htmlContent, designContent } = body;
    const id: string = currentUser ? currentUser.id : '';
    const data: object = {
      templateName,
      subject,
      htmlContent,
      designContent,
    };
    const templateData: Document = new EmailTemplateModel(data);
    const result: Document | any = await templateData.save();

    return res.status(200).json({
      responseCode: 200,
      message: 'Email Template added successfully',
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

/**
 -------------------------------
     UPDATE EMAIL TEMPLATE
 -------------------------------
 */

/**
 * @api {put} email-templates/update      Update Email Template
 * @apiName updateTemplate
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription api for Update Email Template
 * @apiParam {String} id id of Email Template
 * @apiParam {String} title Title of Email Template
 * @apiParam {String} htmlContent Html Content of Email Template
 * @apiParamExample {Object} Request-Example:
   
  {
    "id": "615174f82a0b9b1c60d9e552",
    "title": "registration",
    "htmlContent": "<html><h1>Content</h1></html>",
  }
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  responseCode: 200,
 *   message:"Email Template updated successfully",
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

const updateTemplate = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { body } = req;
    const { id } = body;
    const template = await EmailTemplateModel.findById(id);

    if (template == null) {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'Template'),
        success: false,
      });
    }
    let replaceKey: any = 'Email';
    switch (template.templateName) {
      case 'paymentSuccess':
        replaceKey = 'Payment Success';
        break;
      case 'payment-link':
        replaceKey = 'Payment Link';
        break;
      case 'forget-password':
        replaceKey = 'Forgot Password';
        break;
      case 'registration':
        replaceKey = 'Registration';
        break;

      default:
        break;
    }
    const result: Document = await EmailTemplateModel.updateOne(
      {
        _id: id,
      },
      {
        $set: { ...body, updatedAt: Date.now() },
      }
    );
    return res.status(200).json({
      responseCode: 200,
      message: message.updateSuccess.replace(':item', `${replaceKey} Template`),
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
/**
 ----------------------------------
        GET EMAIL TEMPLATE
 ----------------------------------
 */

/**
 * @api {get} email-templates/get  Get Email Template
 * @apiName getTemplates
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Api To fetch Email Template list 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  message:"Email Template list fetched successfully",
 *   responseCode: 200,
      data: result,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const getTemplates = async (req: Request, res: Response): Promise<any> => {
  try {
    const result: Document[] = await EmailTemplateModel.find();
    return res.status(200).json({
      responseCode: 200,
      data: result,
      message: message.listFetchSuccess.replace(':item', 'Email Template'),
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
 ----------------------------------
        GET AN EMAIL TEMPLATE
 ----------------------------------
 */

/**
 * @api {get} email-templates/view  Get An Email Template
 * @apiName viewTemplate
 * @apiGroup SuperAdmin
 * @apiPermission admin
 * @apiDescription Api To fetch an Email Template details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  message:"Email Template details fetched successfully",
 *   responseCode: 200,
      data: result,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *   HTTP/1.1 404 NotFound
 * {
 *    message: "Data not found.",
 *  responseCode: 404,
 *  success: false
 * }
 *    HTTP/1.1 500 Internal Server Error
 */

const viewTemplate = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query } = req;
    const { id } = query;
    const result = await EmailTemplateModel.findById(id);

    if (result == null) {
      return res.status(404).json({
        responseCode: 404,
        message: message.notFound.replace(':item', 'Data'),
        success: false,
      });
    }
    return res.status(200).json({
      responseCode: 200,
      success: true,
      message: message.viewSuccess.replace(':item', 'Email Template'),
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message ? error.message : message.unexpectedError,
      success: false,
    });
  }
};

export { addTemplate, updateTemplate, getTemplates, viewTemplate };
