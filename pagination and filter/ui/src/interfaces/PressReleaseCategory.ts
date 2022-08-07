import { RouteComponentProps } from "react-router";

export interface IPressReleaseCategoryData {
  categoryName: string;
  isActive: boolean;
  _id?: string;
  createdAt?:any;
}

export interface IPressReleaseCategoryModel {
  isLoading: boolean;
  pressReleaseCategoryData: IPressReleaseCategoryData[];
  pressReleaseCategoryInfo: IPressReleaseCategoryData;
  isError: boolean;
  totalRecords:number;
}

export interface IPressReleaseCategoryState {
  totalRecords: number;
  currentPage: number;
  pageNeighbours: number;
  selectedPressReleaseCategory: any;
  search: any;
  status: any;
  editAccess: any;
}

export interface IPressReleaseCategoryProps extends RouteComponentProps{
  pressReleaseCategoryReducer?: IPressReleaseCategoryModel;
  getPressReleaseCategory: (data:any) => void;
  updatePressReleaseCategoryStatus: (data:any) => void;
  deletePressReleaseCategory: (data:any) => void;
  redirectTo: (data:any) => void;
}

export interface IAddPressReleaseCategoryState{
  categoryName:string;
  id: string,
  isEditable: boolean,
  errors: {
    categoryName: string,
  },
}

export interface IAddPressReleaseCategoryProps extends RouteComponentProps<{
  id:string
}>{
  pressReleaseCategoryReducer:IPressReleaseCategoryModel;
  addPressReleaseCategory:(data:any)=>void;
  updatePressReleaseCategory:(data:any)=>void;
  viewPressReleaseCategory:(data:any)=>void;
}