import { Request, Response } from 'express';
import { EnterpriseModel, EmailTemplateModel } from '../../models';
import { Document, Types } from 'mongoose';
import { validationResult } from 'express-validator';
import { ValidationFormatter } from '../../common/formatter';
import { message as Messages, Email } from '../../common';

/**
 -----------------------
     ADD ENTERPRISE
 -----------------------
 */
/**
 * @api {post} enterprise/  Add Enterprise
 * @apiName addEnterprise
 * @apiGroup Frontend
 * @apiPermission user
 * @apiDescription Add API for Enterprise
 * @apiParam {String} contactNumber contactNumber of the Enterprise.
 * @apiParam {String} topics topic of the Enterprise.
 * @apiParam {String} firstName firstName of the Enterprise.
 * @apiParam {String} lastName lastName of the Enterprise.
 * @apiParam {String} mobileNumber mobileNumber of the Enterprise.
 * @apiParam {String} message message by the Enterprise.
 * @apiParamExample {Object} Request-Example:
{
     "firstName": "jon",
    "lastName": "doe",
    "email":"jon@mail.com"
    "mobileNumber": "9824433224",
    "contactNumber": "9924433224",
    "message": "message is here"
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *    responseCode: 200,
      data: result,
      message: 'Enterprise added successfully.',
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 *    HTTP/1.1 500 Internal Server Error
 */
const addEnterprise = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { body } = req;
    const {
      email,
      firstName,
      lastName,
      mobileNumber,
      contactNumber,
      message,
      topics,
    } = body;

    const data: object = {
      firstName,
      lastName,
      mobileNumber,
      email: email.toLowerCase(),
      topics,
      contactNumber,
      message,
    };
    const enterpriseData: Document = new EnterpriseModel(data);
    const result: any = await enterpriseData.save();
    try {
      // email template for registration
      const availableTemplate: any = await EmailTemplateModel.findOne({
        templateName: {
          $regex: new RegExp('enquiry-template'.trim(), 'i'),
        },
      });

      if (availableTemplate) {
        const upperCaseFirstName =
          `${firstName}`.charAt(0).toUpperCase() + `${firstName}`.slice(1);
        const upperCaseLastName =
          `${lastName}`.charAt(0).toUpperCase() + `${lastName}`.slice(1);
        const name: string = `${upperCaseFirstName} ${upperCaseLastName}`;

        const emailInstance: any = new Email(req);
        await emailInstance.setTemplate(
          availableTemplate.subject,
          availableTemplate.htmlContent,
          {
            name,
            mobileNumber: contactNumber,
            email,
            topics,
            message,
          }
        );
        await emailInstance.sendEmail('questions@coinifide.com'); //questions@coinifide.com
      }
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        responseCode: 400,
        message: error.message,
      });
    }
    try {
      // email template for registration
      const availableTemplate: any = await EmailTemplateModel.findOne({
        templateName: {
          $regex: new RegExp('user enquiry template'.trim(), 'i'),
        },
      });

      if (availableTemplate) {
        const name: string = `${firstName} ${lastName}`;

        const emailInstance: any = new Email(req);
        await emailInstance.setTemplate(
          availableTemplate.subject,
          availableTemplate.htmlContent,
          {
            name,
            topics,
            message,
          }
        );
        await emailInstance.sendEmail(email); //questions@coinifide.com
      }
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        responseCode: 400,
        message: error.message,
      });
    }

    return res.status(200).json({
      responseCode: 200,
      data: result,
      message: 'Your Enquiry Submitted Successfully', // Messages.addedSuccess.replace(':item', 'Enterprise'),
    });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error && error.message
          ? error.message
          : Messages.unexpectedError,
      success: false,
    });
  }
};

export { addEnterprise };
