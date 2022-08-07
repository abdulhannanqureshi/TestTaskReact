import { IOurTeamModel } from "../interfaces";

export const OurTeamInitialState: IOurTeamModel = {
  firstName: "",
  lastName: "",
  email: "",
  designation: "",
  order:"",
  aboutUs: "",
  _id: "",
  teamMemberImage: "",
  isActive: false,
  teamData: [],
  isError: false,
  ourTeamView: null,
};
