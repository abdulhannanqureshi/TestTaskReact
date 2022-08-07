import { RouteComponentProps } from "react-router";

export interface IPromoCodeData {
  courseName: string;
  courseId: string;
  promoTitle: string;
  promoCode: string;
  startDate: any;
  endDate:any;
  percentOff:string;
  isActive: boolean;
  _id?: string;
  createdAt?:any;
}

export interface IPromoCodeModel {
  isLoading: boolean;
  promoCodeData: IPromoCodeData[];
  promoCodeInfo: IPromoCodeData;
  courseData:[];
  isError: boolean;
  totalRecords:number;
  currentPage:number;
}

export interface IPromoCodeState {
  totalRecords: number;
  currentPage: number;
  pageNeighbours: number;
  selectedPromoCode: any;
  search: any;
  status: any;
  startDate: any;
  endDate: any;
  editAccess: any;
  minusSign: boolean,
  checkboxStatus:boolean
}

export interface IPromoCodeProps extends RouteComponentProps {
  promoCodeReducer: IPromoCodeModel;
  courseReducer: IPromoCodeModel;
  getCourses: () => void;
  getPromoCode: (data: any) => void;
  bulkAction: (data: any) => void;
  updatePromoCodeStatus: (data: any) => void;
  deletePromoCode: (data: any) => void;
  redirectTo: (data: any) => void;
}

export interface IAddPromoCodeState{
  courseId: string;
  promoTitle: string;
  promoCode: string;
  startDate: any;
  endDate:any;
  percentOff:string;
  id: string,
  isEditable: boolean,
  errors: {
    courseId: string;
    promoTitle: string;
    promoCode: string;
    startDate: string;
    endDate:string;
    percentOff:string;
  },
}

export interface IAddPromoCodeProps extends RouteComponentProps<{
  id:string
}>{
  promoCodeReducer:IPromoCodeModel;
  courseReducer:IPromoCodeModel;
  bulkAction: (data:any) => void;
  getCourses:()=>void;
  addPromoCode:(data:any)=>void;
  updatePromoCode:(data:any)=>void;
  viewPromoCode:(data:any)=>void;
}