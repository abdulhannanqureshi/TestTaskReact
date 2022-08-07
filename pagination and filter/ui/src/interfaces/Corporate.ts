import { RouteComponentProps } from "react-router";

// Corporate Add
export interface ICorporateState {
  name: string;
  isEditable: boolean;
  errors: any;
}
export interface ICorporateProps
  extends RouteComponentProps<{
    id: string;
  }> {
  addCorporate: (data: any) => void;
  getCorporate: (data: any) => void;
  updateCorporateStatus:(data: any) => void;
  corporateReducer: ICorporateModel;
}

// For Redux
export interface ICorporateModel {
  isError: boolean;
  isLoading: boolean;
  totalRecords: number;
  name: string;
  corporateData: ICorporateGetData[];
  corporateView: any;
}

export interface ICorporateGetData {
  name: string;
  isActive: boolean;
  _id: string;
  createdAt?: any;
}

// For Get Corporate
export interface IGetCorporateState {
  status:any;
}