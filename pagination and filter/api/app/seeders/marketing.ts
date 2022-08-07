import { MarketingModel, EmailTemplateModel } from '../models';
import {
  marketWebPageContent,
  footerPageContent,
  labsWebPageContent,
  aboutUsContent,
  enterpriseWebPageContent,
  courseWebPageContent,
  certificationPageContent,
  universityPageContent,
  homePageContent,
} from '../common';

const addMarketWebPage = async () => {
  const data: any = {
    title: marketWebPageContent.title,
    titleSlug: marketWebPageContent.titleSlug,
    block1: marketWebPageContent.block1,
    blockTitle1: marketWebPageContent.blockTitle1,
    blockTitle2: marketWebPageContent.blockTitle2,
    block2: marketWebPageContent.block2,
    block3: marketWebPageContent.block3,
    blockTitle3: marketWebPageContent.blockTitle3,
    block4: marketWebPageContent.block4,
    blockTitle4: marketWebPageContent.blockTitle4,
    block5: marketWebPageContent.block5,
    blockTitle5: marketWebPageContent.blockTitle5,
    blockTitle6: marketWebPageContent.blockTitle6,
    blockTitle7: marketWebPageContent.blockTitle7,
    blockTitle8: marketWebPageContent.blockTitle8,
    blockTitle9: marketWebPageContent.blockTitle9,
    blockTitle11: marketWebPageContent.blockTitle11,
    blockTitle12: marketWebPageContent.blockTitle12,
    blockTitle13: marketWebPageContent.blockTitle13,
    block6: marketWebPageContent.block6,
  };
  const pageExist = await MarketingModel.findOne({
    titleSlug: data.titleSlug,
  });
  if (!pageExist) {
    const templateData: any = new MarketingModel(data);
    const result: any = await templateData.save();
  }
};
const addCourseWebPage = async () => {
  const data: any = {
    title: courseWebPageContent.title,
    titleSlug: courseWebPageContent.titleSlug,
    block1: courseWebPageContent.block1,
    blockTitle1: courseWebPageContent.blockTitle1,
    block2: courseWebPageContent.block2,
    block3: courseWebPageContent.block3,
    block4: courseWebPageContent.block4,
  };
  const pageExist = await MarketingModel.findOne({
    titleSlug: data.titleSlug,
  });
  if (!pageExist) {
    const templateData: any = new MarketingModel(data);
    const result: any = await templateData.save();
  }
};
const addhomePage = async () => {
  const data: any = {
    title: homePageContent.title,
    titleSlug: homePageContent.titleSlug,
    block1: homePageContent.block1,
    blockTitle1: homePageContent.blockTitle1,
    block2: homePageContent.block2,
    blockTitle2: homePageContent.blockTitle2,
  };
  const pageExist = await MarketingModel.findOne({
    titleSlug: data.titleSlug,
  });
  if (!pageExist) {
    const templateData: any = new MarketingModel(data);
    const result: any = await templateData.save();
  }
};
const addUniversityPage = async () => {
  const data: any = {
    title: universityPageContent.title,
    titleSlug: universityPageContent.titleSlug,
    block1: universityPageContent.block1,
    blockTitle1: universityPageContent.blockTitle1,
    block2: universityPageContent.block2,
    blockTitle2: universityPageContent.blockTitle2,
    block3: universityPageContent.block3,
    blockTitle3: universityPageContent.blockTitle3,
    block4: universityPageContent.block4,
    blockTitle4: universityPageContent.blockTitle4,
    block5: universityPageContent.block5,
    block6: universityPageContent.block6,
  };
  const pageExist = await MarketingModel.findOne({
    titleSlug: data.titleSlug,
  });
  if (!pageExist) {
    const templateData: any = new MarketingModel(data);
    const result: any = await templateData.save();
  }
};
const addEnterpriseWebPage = async () => {
  const data: any = {
    title: enterpriseWebPageContent.title,
    titleSlug: enterpriseWebPageContent.titleSlug,
    block1: enterpriseWebPageContent.block1,
    block2: enterpriseWebPageContent.block2,
    block3: enterpriseWebPageContent.block3,
    block4: enterpriseWebPageContent.block4,
    blockTitle4: enterpriseWebPageContent.blockTitle4,
    block5: enterpriseWebPageContent.block5,
    blockTitle5: enterpriseWebPageContent.blockTitle5,
    block6: enterpriseWebPageContent.block6,
    block7: enterpriseWebPageContent.block7,
  };
  const pageExist = await MarketingModel.findOne({
    titleSlug: data.titleSlug,
  });
  if (!pageExist) {
    const templateData: any = new MarketingModel(data);
    const result: any = await templateData.save();
  }
};
const addFooterWebPage = async () => {
  const data: any = {
    title: footerPageContent.title,
    titleSlug: footerPageContent.titleSlug,
    blockTitle1: footerPageContent.blockTitle1,
    blockTitle2: footerPageContent.blockTitle2,
    blockTitle3: footerPageContent.blockTitle3,
    blockTitle4: footerPageContent.blockTitle4,
    blockTitle5: footerPageContent.blockTitle5,
    blockTitle6: footerPageContent.blockTitle6,
  };
  const pageExist = await MarketingModel.findOne({
    titleSlug: data.titleSlug,
  });
  if (!pageExist) {
    const templateData: any = new MarketingModel(data);
    const result: any = await templateData.save();
  }
};
const addLabsWebPage = async () => {
  const data: any = {
    title: labsWebPageContent.title,
    titleSlug: labsWebPageContent.titleSlug,
    block1: labsWebPageContent.block1,
    block2: labsWebPageContent.block2,
    block3: labsWebPageContent.block3,
    blockTitle4: labsWebPageContent.blockTitle4,
  };
  const pageExist = await MarketingModel.findOne({
    titleSlug: data.titleSlug,
  });
  if (!pageExist) {
    const templateData: any = new MarketingModel(data);
    const result: any = await templateData.save();
  }
};
const addAboutUsPage = async () => {
  const data: any = {
    title: aboutUsContent.title,
    titleSlug: aboutUsContent.titleSlug,
    bannerTitle: aboutUsContent.bannerTitle,
    block1: aboutUsContent.block1,
    blockTitle1: aboutUsContent.blockTitle1,
    block2: aboutUsContent.block2,
    blockTitle2: aboutUsContent.blockTitle2,
  };
  const pageExist = await MarketingModel.findOne({
    titleSlug: data.titleSlug,
  });
  if (!pageExist) {
    const templateData: any = new MarketingModel(data);
    const result: any = await templateData.save();
  }
};
const addCertificateWebPage = async () => {
  const data: any = {
    title: certificationPageContent.title,
    titleSlug: certificationPageContent.titleSlug,
    bannerTitle: certificationPageContent.bannerTitle,
    block1: certificationPageContent.block1,
    blockTitle1: certificationPageContent.blockTitle1,
    block2: certificationPageContent.block2,
    blockTitle2: certificationPageContent.blockTitle2,
    block3: certificationPageContent.block3,
    block4: certificationPageContent.block4,
    blockTitle5: certificationPageContent.blockTitle5,
    blockTitle4: certificationPageContent.blockTitle4,
  };
  const pageExist = await MarketingModel.findOne({
    titleSlug: data.titleSlug,
  });
  if (!pageExist) {
    const templateData: any = new MarketingModel(data);
    const result: any = await templateData.save();
  }
};

export default {
  addMarketWebPage,
  addEnterpriseWebPage,
  addhomePage,
  addCourseWebPage,
  addLabsWebPage,
  addAboutUsPage,
  addCertificateWebPage,
  addUniversityPage,
  addFooterWebPage,
};
