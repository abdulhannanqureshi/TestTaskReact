import { ISettingModel } from "../interfaces";

export const SettingInitialState: ISettingModel = {
  isLoading: true,
  settingData: [],
  settingInfo: {
    courseDuration: "",
    moduleDuration: "",
    certificateAmount: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    pinterest: "",
    phone: "",
    email: "",
    headOfficeAddress: "",
  },
  isError: false,
  totalRecords: 0,
};
