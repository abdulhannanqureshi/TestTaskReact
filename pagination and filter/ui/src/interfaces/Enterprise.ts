import { RouteComponentProps } from "react-router";

export interface IEnterpriseData {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  topics:string;
  message:string;
  isActive: boolean;
  _id?: string;
  createdAt?:any;
}


export interface IEnterpriseState {
  totalRecords: number;
  currentPage: number;
  pageNeighbours: number;
  selectedEnterprise:any;
  search: any;
  status:any;
}

export interface IEnterpriseModel {
    isLoading: boolean;
    enterpriseData: IEnterpriseData[];
    enterpriseInfo: IEnterpriseData;
    isError: boolean;
    totalRecords:number;
    currentPage:number;
  }

export interface IEnterpriseProps extends RouteComponentProps{
  enterpriseReducer: IEnterpriseModel;
  getEnterprises: (data:any) => void;
  redirectTo: (data:any) => void;
}
