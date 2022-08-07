import { cmsModel, EmailTemplateModel } from '../models';
import {
  refundPolicyContent,
  certificatePageContent,
  termsAndConditionContent,
  doNotSellContent,
  privacyPolicyContent,
} from '../common';

const addRefundPolicy = async () => {
  const data: any = {
    pageName: refundPolicyContent.pageName,
    content: refundPolicyContent.content,
    title: refundPolicyContent.title,
  };
  const templateExist = await cmsModel.findOne({
    pageName: data.pageName,
  });
  if (!templateExist) {
    const templateData: any = new cmsModel(data);
    const result: any = await templateData.save();
  }
};
const addPrivacyPolicy = async () => {
  const data: any = {
    pageName: privacyPolicyContent.pageName,
    content: privacyPolicyContent.content,
    title: privacyPolicyContent.title,
  };
  const templateExist = await cmsModel.findOne({
    pageName: data.pageName,
  });
  if (!templateExist) {
    const templateData: any = new cmsModel(data);
    const result: any = await templateData.save();
  }
};
const addCertificateWebPage = async () => {
  const data: any = {
    pageName: certificatePageContent.pageName,
    content: certificatePageContent.content,
    title: certificatePageContent.title,
  };
  const templateExist = await cmsModel.findOne({
    pageName: data.pageName,
  });
  if (!templateExist) {
    const templateData: any = new cmsModel(data);
    const result: any = await templateData.save();
  }
};
const addTermsAndCondition = async () => {
  const data: any = {
    pageName: termsAndConditionContent.pageName,
    content: termsAndConditionContent.content,
    title: termsAndConditionContent.title,
  };
  const templateExist = await cmsModel.findOne({
    pageName: data.pageName,
  });
  if (!templateExist) {
    const templateData: any = new cmsModel(data);
    const result: any = await templateData.save();
  }
};
const addDoNotSell = async () => {
  const data: any = {
    pageName: doNotSellContent.pageName,
    content: doNotSellContent.content,
    title: doNotSellContent.title,
  };
  const templateExist = await cmsModel.findOne({
    pageName: data.pageName,
  });
  if (!templateExist) {
    const templateData: any = new cmsModel(data);
    const result: any = await templateData.save();
  }
};

export default {
  addRefundPolicy,
  // addCertificateWebPage,
  addTermsAndCondition,
  addDoNotSell,
  addPrivacyPolicy,
};
