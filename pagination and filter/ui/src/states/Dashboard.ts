import { IDashboardModel } from "../interfaces";

export const DashboardInitialState: IDashboardModel = {
  isLoading: true,
  dashboardData:{
    availableCourse:'',
    registeredUser:"",
    purchasedCourses:'',
    totalSales:'',
    yearlySales:'',
    todaySales:'',
    monthlySales:'',
    weeklySales:'',
    graphOfSales:[]
  },
  isError: false,
};
