import { RouteComponentProps } from "react-router";

export interface IUserReportData {
  firstName: string;
  lastName: string;
  email:string;
  _id?: string;
  createdAt?:any;
}


export interface IUserReportState {
  totalRecords: number;
  currentPage: number;
  pageNeighbours: number;
  selectedUserReport:any;
  search: any;
  status:any;
}

export interface IUserReportModel {
    isLoading: boolean;
    userReportData: IUserReportData[];
    userReportInfo: IUserReportData;
    isError: boolean;
    totalRecords:number;
  }

export interface IUserReportProps extends RouteComponentProps{
  userReportReducer?: IUserReportModel;
  getUserReport: (data:any) => void;
  redirectTo: (data:any) => void;
}


export interface ISaleReportData {
    transactionId: string;
    grandTotal: string;
    fullName:string;
    courseName: string;
    promoCode: string;
    _id?: string;
    createdAt?:any;
  }
  
  
  export interface ISaleReportState {
    totalRecords: number;
    currentPage: number;
    pageNeighbours: number;
    selectedSaleReport:any;
    search: any;
    status:any;
  }
  
  export interface ISaleReportModel {
      isLoading: boolean;
      saleReportData: ISaleReportData[];
      saleReportInfo: ISaleReportData;
      isError: boolean;
      totalRecords:number;
    }
  
  export interface ISaleReportProps extends RouteComponentProps{
    saleReportReducer?: ISaleReportModel;
    getSaleReport: (data:any) => void;
    redirectTo: (data:any) => void;
  }
  