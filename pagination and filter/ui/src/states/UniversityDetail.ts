import { IUniversityListingModel } from "../interfaces";

export const UniversityInitialState: IUniversityListingModel = {
  isLoading: true,
  currentPage: 1,
  userReport:'',
  universityInfo:[],
  universityData: [],
  corporateData: [],
  isError: false,
  totalRecords:0,
};
 