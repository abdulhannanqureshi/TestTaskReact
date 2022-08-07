import { RouteComponentProps } from "react-router";
export interface IDashboardData {
  availableCourse: string;
  registeredUser: string;
  purchasedCourses: string;
  totalSales: string;
  yearlySales: string,
  todaySales: string,
  monthlySales: string,
  weeklySales: string,
  graphOfSales:[]
}
export interface IDashboardState {
  type:any;
  availableCourse: any;
  registeredUser: any;
  purchasedCourses: any;
  totalSales: any;
  yearlySales:any;
  todaySales:any;
  monthlySales:any;
  weeklySales:any;
  graphOfSales:any
}

export interface IDashboardModel {
  isLoading: boolean;
  dashboardData: IDashboardData;
  isError: boolean;
}

export interface IDashboardProps extends RouteComponentProps{
  dashboardReducer?: IDashboardModel;
  getDashboard: (data:any) => void;
  redirectTo: (data:any) => void;
}