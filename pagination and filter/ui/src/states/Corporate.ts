import { ICorporateModel } from "../interfaces";

export const CorporateInitialState: ICorporateModel = {
  isLoading: true,
  isError: false,
  totalRecords: 0,
  name: "",
  corporateData: [],
  corporateView: null,
};
