import { IProxyLoginActionData } from "./Login";
import { RouteComponentProps } from "react-router";

export interface IUserData {
  firstName: string;
  lastName: string;
  email: string;
  password:string;
  role:string;
  university:string;
  corporate:string;
  isActive: boolean;
  _id?: string;
  createdAt?:any;
}

export interface IUserModel {
  isLoading: boolean;
  userData: IUserData[];
  userInfo: IUserData;
  universityData:[];
  corporateData:[];
  isError: boolean;
  totalRecords:number;
  currentPage:number;
  userReport:string
}

export interface IUserState {
  totalRecords: number;
  currentPage: number;
  pageNeighbours: number;
  selectedUser: any;
  search: any;
  status: any;
  editAccess: any;
  minusSign:boolean;
  checkboxStatus:boolean
  
}

export interface IUserProps extends RouteComponentProps {
  userReducer: IUserModel;
  getUsers: (data: any) => void;
  updateUserStatus: (data: any) => void;
  deleteUser: (data: any) => void;
  bulkAction: (data: any) => void;
  redirectTo: (data: any) => void;
  getUserReport: (data: any) => void;
}

export interface IAddUserState{
  firstName:string;
  lastName:string;
  email:string;
  password:string;
  role:string;
  university:string;
  corporate:string;
  id: string,
  isEditable: boolean,
  errors: {
    firstName: string,
    lastName: string,
    email: string,
    password:string;
    role:string;
    corporate:string;
    university:string;
  },
  showPass:boolean
}

export interface IAddUserProps extends RouteComponentProps<{
  id:string
}>{
  userReducer:IUserModel;
  universityReducer:IUserModel;
  corporationReducer:IUserModel;
  getUniversity:()=>void;
  getCorporation:()=>void;
  addUser:(data:any)=>void;
  updateUser:(data:any)=>void;
  viewUser:(data:any)=>void;
}

export interface IUniversityData {
  name: string;
  _id?: string;
}

export interface ICorporateData {
  name: string;
  _id?: string;
}