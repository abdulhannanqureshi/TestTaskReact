import { RouteComponentProps } from "react-router";

export interface ICourseData {
  topicName: string;
  title: string;
  code: string;
  price: string;
  topic: string;
  isActive: boolean;
  _id?: string;
}

export interface ICourseModel {
    isLoading: boolean;
    courseData: ICourseData[];
    categoryData:[],
    courseInfo: ICourseData;
    isError: boolean;
    totalRecords:number;
}

export interface ICourseState {
  totalRecords: number;
  currentPage: number;
  pageNeighbours: number;
  selectedCourse: any;
  search: any;
  status: any;
  editAccess: any;
  minusSign: boolean,
  checkboxStatus:boolean
}

export interface ICourseProps extends RouteComponentProps{
    categoryReducer:ICourseModel;
    courseReducer:ICourseModel;
    getCategory:(data:any)=>void;
    getCourses:(data:any)=>void;
    bulkAction: (data:any) => void;
    redirectTo: (data:any) => void;
    viewCourse:(data:any)=>void;
    updateCourseStatus:(data:any)=>void;
    deleteCourse:(data:any)=>void;
}

export interface IAddCourseState{
    title:string;
    price:string;
    topic:string;
    _id: string,
    isEditable: boolean,
    isActive:boolean,
    errors: {
        title:string;
        price:string;
        topic:string;
    },
}

export interface IAddCourseProps extends RouteComponentProps<{
    id:string
  }>{
    categoryReducer:ICourseModel;
    courseReducer:ICourseModel;
    getCategory:(data:any)=>void;
    getCourses:(data:any)=>void;
    addCourse:(data:any)=>void;
    updateCourse:(data:any)=>void;
    viewCourse:(data:any)=>void;
    updateCourseStatus:(data:any)=>void;
    deleteCourse:(data:any)=>void;
    onEditorStateChange:()=>void;
    redirectTo: (data:any) => void;
  }
