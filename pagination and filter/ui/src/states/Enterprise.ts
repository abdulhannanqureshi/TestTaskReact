import { IEnterpriseModel } from "../interfaces";

export const EnterpriseInitialState: IEnterpriseModel = {
  isLoading: true,
  currentPage: 1,
  enterpriseData: [],
  enterpriseInfo:{
    firstName:'',
    lastName:"",
    email:"",
    contactNumber:'',
    topics:"",
    message:'',
    isActive:false
  },
  isError: false,
  totalRecords:0,
};
