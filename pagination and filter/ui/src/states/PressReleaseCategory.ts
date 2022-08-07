import { IPressReleaseCategoryModel } from "../interfaces";

export const PressReleaseCategoryInitialState: IPressReleaseCategoryModel = {
  isLoading: true,
  pressReleaseCategoryData: [],
  pressReleaseCategoryInfo:{
    categoryName:'',
    isActive:false
  },
  isError: false,
  totalRecords:0,
};
