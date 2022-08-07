import { IUserReportModel, ISaleReportModel } from "../interfaces";

export const UserReportInitialState: IUserReportModel = {
  isLoading: true,
  userReportData: [],
  userReportInfo:{
    firstName:'',
    lastName:"",
    email:'',
  },
  isError: false,
  totalRecords:0,
};

export const SaleReportInitialState: ISaleReportModel = {
    isLoading: true,
    saleReportData: [],
    saleReportInfo:{
        transactionId:'',
        grandTotal:"",
        createdAt:'',
        fullName:'',
        courseName:"",
        promoCode:""
    },
    isError: false,
    totalRecords:0,
  };
  