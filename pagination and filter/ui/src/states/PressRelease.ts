import { IPressReleaseModel } from "../interfaces";

export const PressReleaseInitialState: IPressReleaseModel = {
  isLoading: true,
  pressReleaseData: [],
  pressReleaseCategoryData: [],
  pressReleaseInfo:{
    categoryName: '',
    category:'',
    title:"",
    description:'',
    metaTitle:'',
    metaDescriptin:'',
    metaKeyword:'',
    pressFeatureImage: '',
    isActive:false
  },
  isError: false,
  totalRecords:0,
};
