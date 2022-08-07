import { IProxyLoginActionData } from "./Login";
import { RouteComponentProps } from "react-router";

export interface ICategoryData {
  title: string;
  subTitle: string;
  topicName: string;
  media: string;
  bannerImage: string;
  description: string;
  bodySection1: any;
  bodySection2: any;
  bodySection3: any;
  bodySection4: any;
  bodySectionImage1: string;
  bodySectionImage2: string;
  bodySectionImage3: string;
  bodySectionImage4: string;
  certificateImage:string;
  bannerImageUrl: any;
  isActive: boolean;
  _id?: string;
}

export interface ICategoryModel {
  isLoading: boolean;
  categoryData: ICategoryData[];
  categoryInfo: ICategoryData;
  isError: boolean;
  totalRecords: number;
  currentPage: number;
}

export interface ICategoryState {
  totalRecords: number;
  currentPage: number;
  pageNeighbours: number;
  selectedCategory: any;
  search: any;
  status: any;
  editAccess: any;
  minusSign: boolean,
  checkboxStatus:boolean
}

export interface ICategoryProps extends RouteComponentProps {
  categoryReducer: ICategoryModel;
  getCategory: (data: any) => void;
  updateCategoryStatus: (data: any) => void;
  deleteCategory: (data: any) => void;
  bulkAction: (data:any) => void;
  redirectTo: (data: any) => void;
}

export interface IAddCategoryState {
  title: string;
  subTitle: string;
  topicName: string;
  media: string;
  bannerImage: string;
  dropBannerImage:boolean;
  dropBodySectionImage1:boolean,
  dropBodySectionImage2:boolean,
  dropBodySectionImage3:boolean,
  dropBodySectionImage4:boolean,
  dropcertificateImage:boolean,
  description: string;
  bodySection1: any;
  bodySection2: any;
  bodySection3: any;
  bodySection4: any;
  bodySectionImage1: string;
  bodySectionImage2: string;
  bodySectionImage3: string;
  bodySectionImage4: string;
  certificateImage:string;
  bannerImageUrl: any;
  bodySectionImageUrl1: any;
  bodySectionImageUrl2: any;
  bodySectionImageUrl3: any;
  bodySectionImageUrl4: any;
  certificateImageUrl5:any;
  id: string;
  isEditable: boolean;
  isActive: boolean;
  errors: {
    title: string;
    subTitle: string;
    topicName: string;
    media: string;
    bannerImage: string;
    description: string;
    bodySection1: any;
    bodySection2: any;
    bodySection3: any;
    bodySection4: any;
    bodySectionImage1: string;
    bodySectionImage2: string;
    bodySectionImage3: string;
    bodySectionImage4: string;
    certificateImage:string;
  };
  editorState: any;
  editorState1: any;
  editorState2: any;
  editorState3: any;
  editorState4: any;
}

export interface IAddCategoryProps
  extends RouteComponentProps<{
    id: string;
  }> {
  categoryReducer: ICategoryModel;
  addCategory: (data: any) => void;
  updateCategory: (data: any) => void;
  viewCategory: (data: any) => void;
}
