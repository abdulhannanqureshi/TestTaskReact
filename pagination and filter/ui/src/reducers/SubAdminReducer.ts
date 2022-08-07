import { handleActions } from "redux-actions";
import { SubAdminActionTypes } from "./../actions";
import { ISubAdminModel } from "../interfaces";
import { SubAdminInitialState } from "../states";

export const subAdminReducer = handleActions<ISubAdminModel, any>(
  {
    // For Get Sub Admin
    [SubAdminActionTypes.GET_SUB_ADMIN_REQUEST]: (state, action) => ({
      ...state,
    }),
    [SubAdminActionTypes.GET_SUB_ADMIN_SUCCESS]: (state, action) => ({
      ...state,
      subAdminData: action.payload.subAdminData,
      totalRecords: action.payload.totalRecords,
    }),
    [SubAdminActionTypes.GET_SUB_ADMIN_FAILED]: (state, action) => ({
      ...state,
      isError: true,
    }),
    // For Add Sub Admin
    [SubAdminActionTypes.ADD_SUB_ADMIN_REQUEST]: (state, action) => ({
      ...state,
    }),
    [SubAdminActionTypes.ADD_SUB_ADMIN_FAILED]: (state, action) => ({
      ...state,
    }),
    // For View Sub Admin
    [SubAdminActionTypes.VIEW_SUB_ADMIN_REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [SubAdminActionTypes.VIEW_SUB_ADMIN_SUCCESS]: (state, action) => ({
      ...state,
      subAdminView: action.payload.subAdminView,
      isLoading: false,
    }),
    [SubAdminActionTypes.VIEW_SUB_ADMIN_FAILED]: (state, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),
    // For Edit Corporate
    [SubAdminActionTypes.EDIT_SUB_ADMIN_REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [SubAdminActionTypes.EDIT_SUB_ADMIN_FAILED]: (state, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),
    // For Status & Delete Corporate
    [SubAdminActionTypes.DELETE_SUB_ADMIN_REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [SubAdminActionTypes.DELETE_SUB_ADMIN_SUCCESS]: (state, action) => ({
      ...state,
      subAdminData: action.payload,
      isLoading: false,
    }),
    [SubAdminActionTypes.DELETE_SUB_ADMIN_FAILED]: (state, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),
    // For Check Sub Admin
    [SubAdminActionTypes.CHECK_SUB_ADMIN_SUCCESS]: (state, action) => ({
      ...state,
      subAdminCheck: action.payload,
      isLoading: false,
    }),
    [SubAdminActionTypes.CHECK_SUB_ADMIN_FAILED]: (state, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),
  },
  SubAdminInitialState
);
