import { RouteComponentProps } from "react-router";

export interface ICertificateData {
  firstName: string;
  lastName: string;
  email: string;
  courseName: string;
  status: string;
  linkExpireDate:any;
  _id?: string;
  createdAt?: any;
  validFrom?:any;
  validTo?: any;
}

export interface ICertificateState {
  totalRecords: number;
  currentPage: number;
  pageNeighbours: number;
  selectedCertificate: any;
  search: any;
  status: any;
  startDate: any;
  endDate: any;
  editAccess: any;
  todaysDate:any
}

export interface ICertificateModel {
    isLoading: boolean;
    certificateData: ICertificateData[];
    certificateInfo: ICertificateData;
    isError: boolean;
    totalRecords:number;
    currentPage: number;
  }

export interface ICertificateProps extends RouteComponentProps{
  certificateReducer: ICertificateModel;
  getCertificate: (data:any) => void;
  updateCertificateStatus: (data:any) => void;
  redirectTo: (data:any) => void;
}
