import { RouteComponentProps } from "react-router";

export interface IPressReleaseData {
  categoryName: string;
  category: string;
  title: string;
  description: string;
  metaTitle:string;
  metaDescriptin:string;
  metaKeyword:string;
  isActive: boolean;
  pressFeatureImage:string;
  _id?: string;
  createdAt?:any;
}

export interface IPressReleaseModel {
  isLoading: boolean;
  pressReleaseData: IPressReleaseData[];
  pressReleaseInfo: IPressReleaseData;
  pressReleaseCategoryData: [];
  isError: boolean;
  totalRecords:number;
}

export interface IPressReleaseState {
  totalRecords: number;
  currentPage: number;
  pageNeighbours: number;
  selectedPressRelease: any;
  search: any;
  status: any;
  editAccess: any;
  minusSign: boolean,
  checkboxStatus:boolean
}

export interface IPressReleaseProps extends RouteComponentProps {
  pressReleaseReducer?: IPressReleaseModel;
  getPressRelease: (data: any) => void;
  updatePressReleaseStatus: (data: any) => void;
  deletePressRelease: (data: any) => void;
  bulkAction: (data: any) => void;
  redirectTo: (data: any) => void;
  getPressReleaseCategory: (data: any) => void;
}

export interface IAddPressReleaseState {
  category: string;
  title: string;
  description: string;
  metaTitle: string;
  metaDescriptin: string;
  metaKeyword: string;
  id: string;
  isEditable: boolean;
  editorState1: any;
  pressFeatureImageUrl: any;
  pressFeatureImage: any;
  dropPressFeatureImage: boolean;
  errors: {
    category: string;
    title: string;
    description: string;
    pressFeatureImage: string;
  };
}

export interface IAddPressReleaseProps
  extends RouteComponentProps<{
    id: string;
  }> {
  pressReleaseReducer: IPressReleaseModel;
  pressReleaseCategoryReducer: IPressReleaseModel;
  addPressRelease: (data: any) => void;
  updatePressRelease: (data: any) => void;
  viewPressRelease: (data: any) => void;
  getPressReleaseCategory: (data: any) => void;
}