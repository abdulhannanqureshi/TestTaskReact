import { RouteComponentProps } from "react-router";

// For Redux
export interface ILabModel {
  courseName:string;
  category: string;
  title: string;
  _id:string;
  link: string;
  description: string;
  amount: string;
  labsImage: string;
  isActive: boolean;
  LabData: any;
  isError: boolean;
  labView: any;
}
