import { IModuleModel } from "../interfaces";

export const ModuleInitialState: IModuleModel = {
  isLoading: true,
  currentPage: 1,
  moduleData: [],
  courseData: [],
  talentmoduledata: [],
  moduleInfo: {
    courseName: "",
    moduleName: "",
    course: "",
    code: "",
    category: "",
    amount: "",
    isActive: false,
  },
  isError: false,
  totalRecords: 0,
};
