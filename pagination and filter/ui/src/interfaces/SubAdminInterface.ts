import { RouteComponentProps } from "react-router";

// For Redux
export interface ISubAdminModel {
  // For api data interface
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdBy: string;
  rolesPermission: any;
  roleName: string;
  // For extra api data interface
  _id: string;
  isActive: boolean;
  subAdminData: any;
  subAdminView: any;
  isError: boolean;
  totalRecords: number;
  subAdminCheck: any;
}
