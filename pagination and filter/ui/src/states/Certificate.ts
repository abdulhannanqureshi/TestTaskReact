import { ICertificateModel } from "../interfaces";

export const CertificateInitialState: ICertificateModel = {
  isLoading: true,
  currentPage: 1,
  certificateData: [],
  certificateInfo:{
    firstName:'',
    lastName:"",
    email:"",
    courseName:'',
    linkExpireDate:'',
    status:'',
    createdAt:'',
  },
  isError: false,
  totalRecords:0,
};
