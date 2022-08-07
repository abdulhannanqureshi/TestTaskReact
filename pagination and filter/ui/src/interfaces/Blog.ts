import { RouteComponentProps } from "react-router";

export interface IBlogData {
  categoryName: string;
  category: string;
  title: string;
  description: string;
  metaTitle:string;
  metaDescriptin:string;
  metaKeyword:string;
  blogFeatureImage:string;
  isActive: boolean;
  _id?: string;
  createdAt?:any;
}

export interface IBlogModel {
  isLoading: boolean;
  blogData: IBlogData[];
  blogInfo: IBlogData;
  blogCategoryData: [];
  isError: boolean;
  totalRecords:number;
}

export interface IBlogState {
  totalRecords: number;
  currentPage: number;
  pageNeighbours: number;
  selectedBlog: any;
  search: any;
  status: any;
  editAccess: any;
  minusSign: boolean,
  checkboxStatus:boolean
}

export interface IBlogProps extends RouteComponentProps{
  blogReducer?: IBlogModel;
  blogCategoryReducer:IBlogModel;
  getBlog: (data:any) => void;
  updateBlogStatus: (data:any) => void;
  deleteBlog: (data:any) => void;
  bulkAction: (data:any) => void;
  redirectTo: (data:any) => void;
  getBlogCategory:(data:any)=>void;
}

export interface IAddBlogState{
  category:string;
  title:string;
  description:string;
  metaTitle:string;
  metaDescriptin:string;
  metaKeyword:string;
  id: string,
  isEditable: boolean,
  editorState1: any,
  dropBlogFeatureImage:boolean,
  blogFeatureImageUrl: any,
  blogFeatureImage: any,
  errors: {
    category: string,
    title: string,
    description: string,
    blogFeatureImage: string,
  },
}

export interface IAddBlogProps extends RouteComponentProps<{
  id:string
}>{
  blogReducer:IBlogModel;
  blogCategoryReducer:IBlogModel;
  addBlog:(data:any)=>void;
  updateBlog:(data:any)=>void;
  viewBlog:(data:any)=>void;
  getBlogCategory:(data:any)=>void;
}