import { IBlogModel } from "../interfaces";

export const BlogInitialState: IBlogModel = {
  isLoading: true,
  blogData: [],
  blogCategoryData: [],
  blogInfo:{
    categoryName: '',
    category:'',
    title:"",
    description:'',
    metaTitle:'',
    metaDescriptin:'',
    metaKeyword:'',
    blogFeatureImage: '',
    isActive:false
  },
  isError: false,
  totalRecords:0,
};
