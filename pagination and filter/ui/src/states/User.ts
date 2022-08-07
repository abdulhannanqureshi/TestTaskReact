import { IUserModel } from "../interfaces";

export const UserInitialState: IUserModel = {
  isLoading: true,
  currentPage: 1,
  userData: [],
  userReport:'',
  universityData: [],
  corporateData: [],
  userInfo:{
    firstName:'',
    lastName:"",
    email:'',
    password:'',
    role:'',
    university: '',
    corporate: '',
    isActive:false
  },
  isError: false,
  totalRecords:0,
};
