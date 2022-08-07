import { RouteComponentProps } from "react-router";

export interface IBlogCategoryData {
    categoryName: string;
  isActive: boolean;
  _id?: string;
  createdAt?:any;
}

export interface IBlogCategoryModel {
  isLoading: boolean;
  blogCategoryData: IBlogCategoryData[];
  blogCategoryInfo: IBlogCategoryData;
  isError: boolean;
  totalRecords:number;
}

export interface IBlogCategoryState {
  totalRecords: number;
  currentPage: number;
  pageNeighbours: number;
  selectedBlogCategory: any;
  search: any;
  status: any;
  editAccess: any;
}

export interface IBlogCategoryProps extends RouteComponentProps{
    blogCategoryReducer?: IBlogCategoryModel;
  getBlogCategory: (data:any) => void;
  updateBlogCategoryStatus: (data:any) => void;
  deleteBlogCategory: (data:any) => void;
  redirectTo: (data:any) => void;
}

export interface IAddBlogCategoryState{
    categoryName:string;
  id: string,
  isEditable: boolean,
  errors: {
    categoryName: string,
  },
}

export interface IAddBlogCategoryProps extends RouteComponentProps<{
  id:string
}>{
    blogCategoryReducer:IBlogCategoryModel;
  addBlogCategory:(data:any)=>void;
  updateBlogCategory:(data:any)=>void;
  viewBlogCategory:(data:any)=>void;
}