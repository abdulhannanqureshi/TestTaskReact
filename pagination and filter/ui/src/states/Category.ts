import { ICategoryModel } from "../interfaces";

export const CategoryInitialState: ICategoryModel = {
  isLoading: true,
  currentPage: 1,
  categoryData: [],
  categoryInfo: {
    title: "",
    subTitle: "",
    topicName: "",
    media: "",
    bannerImage: "",
    description: "",
    bodySection1: "",
    bodySection2: "",
    bodySection3: "",
    bodySection4: "",
    bodySectionImage1: "",
    bodySectionImage2: "",
    bodySectionImage3: "",
    bodySectionImage4: "",
    certificateImage:"",
    bannerImageUrl: "",
    isActive: true,
  },
  isError: false,
  totalRecords: 0,
};
