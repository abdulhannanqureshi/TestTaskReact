import { IBlogCategoryModel } from "../interfaces";

export const BlogCategoryInitialState: IBlogCategoryModel = {
  isLoading: true,
  blogCategoryData: [],
  blogCategoryInfo:{
    categoryName:'',
    isActive:false
  },
  isError: false,
  totalRecords:0,
};
