import { ISubAdminModel } from "../interfaces";

export const SubAdminInitialState: ISubAdminModel = {
  // For api data state
  firstName: "",
  lastName: "",
  email: "",
  role: "",
  createdBy: "",
  roleName: "",
  rolesPermission: [],
  // For extra api data state
  _id: "",
  isActive: false,
  subAdminData: [],
  subAdminView: null,
  isError: false,
  totalRecords: 0,
  subAdminCheck: [],
};
