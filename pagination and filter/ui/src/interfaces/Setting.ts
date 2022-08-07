import { IProxyLoginActionData } from "./Login";
import { RouteComponentProps } from "react-router";

export interface ISettingData {
  courseDuration: string;
  moduleDuration: string;
  certificateAmount: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  pinterest: string;
  phone: string;
  email: string;
  headOfficeAddress: string;
  _id?: string;
}

export interface ISettingModel {
  isLoading: boolean;
  settingData: ISettingData[];
  settingInfo: ISettingData;
  isError: boolean;
  totalRecords: number;
}

export interface ISettingProps extends RouteComponentProps {
  settingReducer?: ISettingModel;
  getSetting: (data: any) => void;
  redirectTo: (data: any) => void;
}

export interface ISettingState {
  courseDuration: string;
  moduleDuration: string;
  certificateAmount: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  pinterest: string;
  phone: string;
  email: string;
  headOfficeAddress: string;
  id: string;
  isEditable: boolean;
  editAccess: any;
  errors: {
    courseDuration: string;
    moduleDuration: string;
    certificateAmount: string;
    facebook: string;
    twitter: string;
    linkedin: string;
    pinterest: string;
    phone: string;
    email: string;
    headOfficeAddress: string;
  };
}

export interface IAddSettingProps extends RouteComponentProps<{
  id:string
}>{
  settingReducer:ISettingModel;
  updateSetting:(data:any)=>void;
  viewSetting:(data:any)=>void;
}