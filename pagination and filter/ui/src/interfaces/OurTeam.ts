import { RouteComponentProps } from "react-router";

// For Redux
export interface IOurTeamModel {
  firstName: string;
  lastName: string;
  email: string;
  designation: string;
  order: string ;
  aboutUs: string;
  _id: string;
  teamMemberImage: string;
  isActive: boolean;
  teamData: any;
  isError: boolean;
  ourTeamView: any;
}
