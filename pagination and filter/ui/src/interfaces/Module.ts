import { IProxyLoginActionData } from "./Login";
import { RouteComponentProps } from "react-router";

export interface IModuleData {
  courseName: string;
  moduleName: string;
  course: string;
  code: string;
  category: string;
  amount: string;
  isActive: boolean;
  _id?: string;
  createdAt?: any;
}

export interface IModuleModel {
  isLoading: boolean;
  moduleData: IModuleData[];
  moduleInfo: IModuleData;
  talentmoduledata: [];
  courseData: [];
  isError: boolean;
  totalRecords: number;
  currentPage: number;
}

export interface IModuleState {
  totalRecords: number;
  currentPage: number;
  pageNeighbours: number;
  selectedModule: any;
  search: any;
  status: any;
  editAccess: any;
  minusSign: boolean,
  checkboxStatus:boolean
}

export interface IModuleProps extends RouteComponentProps{
  moduleReducer: IModuleModel;
  courseReducer:IModuleModel;
  getModules: (data:any) => void;
  updateModuleStatus: (data:any) => void;
  deleteModule: (data:any) => void;
  bulkAction: (data:any) => void;
  redirectTo: (data:any) => void;
  getCourses:()=>void;
  talentlms:(data:any) =>void
}

export interface IAddModuleState{
  moduleName:string,
  course:string,
  category:string,
  amount:string,
  id: string,
  isEditable: boolean,
  errors: {
    moduleName:string,
    course:string,
    category:string,
    amount:string,
  },
}

export interface IAddModuleProps extends RouteComponentProps<{
  id:string
}>{
  moduleReducer:IModuleModel;
  courseReducer:IModuleModel;
  addModule:(data:any)=>void;
  updateModule:(data:any)=>void;
  viewModule:(data:any)=>void;
  getCourses:()=>void;
}