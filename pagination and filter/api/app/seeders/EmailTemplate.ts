import { EmailTemplateModel } from '../models';
import {
  registerContent,
  enquiryContent,
  forgotPasswordContent,
  paymentSuccess,
  paymentLinkContent,
  userEnquiryMailContent,
  emailChangesContent,
} from '../common';

const addRegistrationTemplate = async () => {
  let htmlContent: String = registerContent;
  const data: any = {
    templateName: 'registration',
    htmlContent,
    subject: 'Welcome !!',
  };
  const templateExist = await EmailTemplateModel.find({
    templateName: data.templateName,
  });
  if (templateExist.length === 0) {
    const templateData: any = new EmailTemplateModel(data);
    const result: any = await templateData.save();
  }
};
const addEnquiryTemplate = async () => {
  let htmlContent: String = enquiryContent;
  const data: any = {
    templateName: 'enquiry-template',
    htmlContent,
    subject: 'An Query Arrived !!',
  };
  const templateExist = await EmailTemplateModel.find({
    templateName: data.templateName,
  });
  if (templateExist.length === 0) {
    const templateData: any = new EmailTemplateModel(data);
    const result: any = await templateData.save();
  }
};
const addUserEnquiryMailTemplate = async () => {
  let htmlContent: String = userEnquiryMailContent;
  const data: any = {
    templateName: 'user enquiry template',
    htmlContent,
    subject: 'Query Submitted Successfully !!',
  };
  const templateExist = await EmailTemplateModel.find({
    templateName: data.templateName,
  });
  if (templateExist.length === 0) {
    const templateData: any = new EmailTemplateModel(data);
    const result: any = await templateData.save();
  }
};
const addEmailChangesMailTemplate = async () => {
  let htmlContent: String = emailChangesContent;
  const data: any = {
    templateName: 'email-change',
    htmlContent,
    subject: 'Your Email changed Successfully !!',
  };
  const templateExist = await EmailTemplateModel.find({
    templateName: data.templateName,
  });
  if (templateExist.length === 0) {
    const templateData: any = new EmailTemplateModel(data);
    const result: any = await templateData.save();
  }
};

const forgetPasswordTemplate = async () => {
  let htmlContent: String = forgotPasswordContent;
  const data: any = {
    templateName: 'forget-password',
    htmlContent,
    subject: 'Forget Password',
  };
  const templateExist = await EmailTemplateModel.find({
    templateName: data.templateName,
  });
  if (templateExist.length === 0) {
    const templateData: any = new EmailTemplateModel(data);
    const result: any = await templateData.save();
  }
};
const paymentLinkTemplate = async () => {
  let htmlContent: String = paymentLinkContent;
  const data: any = {
    templateName: 'payment-link',
    htmlContent,
    subject: 'Payment Link for Certificate',
  };
  const templateExist = await EmailTemplateModel.find({
    templateName: data.templateName,
  });
  if (templateExist.length === 0) {
    const templateData: any = new EmailTemplateModel(data);
    const result: any = await templateData.save();
  }
};
const paymentSuccessTemplate = async () => {
  let htmlContent: String = paymentSuccess;
  const data: any = {
    templateName: 'paymentSuccess',
    htmlContent,
    subject: 'Thank You !!',
  };
  const templateExist = await EmailTemplateModel.find({
    templateName: data.templateName,
  });
  if (templateExist.length === 0) {
    const templateData: any = new EmailTemplateModel(data);
    const result: any = await templateData.save();
  }
};
export default {
  addRegistrationTemplate,
  forgetPasswordTemplate,
  paymentSuccessTemplate,
  paymentLinkTemplate,
  addEnquiryTemplate,
  addUserEnquiryMailTemplate,
  addEmailChangesMailTemplate,
};

// <!doctype html><html></body><div style=\" margin: 15px 0px;padding: 0;color: #555555;font-family: Arial;font-size: 15px;line-height: 25px;text-align: left;clear: both;\">\n                Hi ##firstName## ,\n            </div>\n            <div style=\" margin: 15px 0px;padding: 0;color: #555555;font-family: Arial;font-size: 14px;line-height: 24px;text-align: left;clear: both;\">\n                 Your account is Registered.\n            </div> </body> </html>
