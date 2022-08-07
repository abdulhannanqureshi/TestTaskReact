import { handleActions } from "redux-actions";
import { CorporateActionTypes } from "./../actions";
import { ICorporateModel } from "../interfaces";
import { CorporateInitialState } from "../states";

export const corporateReducer = handleActions<ICorporateModel, any>(
  {
    // For Get Corporate
    [CorporateActionTypes.GET_CORPORATE_REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [CorporateActionTypes.GET_CORPORATE_SUCCESS]: (state, action) => ({
      ...state,
      corporateData: action.payload.corporateData,
      totalRecords: action.payload.totalRecords,
      isLoading: false,
    }),
    [CorporateActionTypes.GET_CORPORATE_FAILED]: (state, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),
    // For Add Corporate
    [CorporateActionTypes.ADD_CORPORATE_REQUEST]: (state, action) => ({
      ...state,
    }),
    [CorporateActionTypes.ADD_CORPORATE_FAILED]: (state, action) => ({
      ...state,
    }),
    // For Status Corporate
    [CorporateActionTypes.STATUS_CORPORATE_REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [CorporateActionTypes.STATUS_CORPORATE_SUCCESS]: (state, action) => ({
      ...state,
      corporateData: action.payload,
      isLoading: false,
    }),
    [CorporateActionTypes.STATUS_CORPORATE_FAILED]: (state, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),
    // For View Corporate
    [CorporateActionTypes.VIEW_CORPORATE_REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [CorporateActionTypes.VIEW_CORPORATE_SUCCESS]: (state, action) => ({
      ...state,
      corporateView: action.payload.corporateView,
      isLoading: false,
    }),
    [CorporateActionTypes.VIEW_CORPORATE_FAILED]: (state, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),
    // For Edit Corporate
    [CorporateActionTypes.EDIT_CORPORATE_REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [CorporateActionTypes.EDIT_CORPORATE_FAILED]: (state, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),
  },
  CorporateInitialState
);
