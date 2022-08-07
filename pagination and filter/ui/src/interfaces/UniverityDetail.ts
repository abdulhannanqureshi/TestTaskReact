import { IProxyLoginActionData } from "./Login";
import { RouteComponentProps } from "react-router";


export interface IUniversityListingData {
  name: string;
  university:any;
  country:string;
  url:string;
  corporate:string;
  isActive: boolean;
  _id?: string;
  createdAt?:any;
}
export interface IUniversityListingState {
  totalRecords: number;
  currentPage: number;
  pageNeighbours: number;
  selectedUser: any;
  // search
  search: string;
  status: any;
  editAccess: any;
}
export interface IUniversityListingModel {
  isLoading: boolean;
  universityData: [];
  corporateData: [];
  isError: boolean;
  totalRecords: number;
  currentPage: number;
  userReport: string;
  universityInfo: any;
}
export interface IUniversityListingProps
  extends RouteComponentProps<{
    id: string;
  }> {
  universityReducer: IUniversityListingModel;
  redirectTo: (data: any) => void;
  getUniversityList: (data: any) => void;
  deleteUniversity: (data: any) => void;
  updateUniversityStatus: (data: any) => void;
}

export interface IUniversityState {
  name: string;
  errors: any;
  isEditable: boolean;
  id:string

}
export interface IUniversityProps extends RouteComponentProps<{
  id:string
}>{
  universityReducer:IUniversityListingModel;
  addUser:(data:any)=>void;
  updateUniversity:(data:any)=>void;
  viewUniversity:(data:any)=>void
}



