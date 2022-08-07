import { handleActions } from "redux-actions";
import { LabActionTypes } from "./../actions";
import { ILabModel } from "../interfaces";
import { labInitialState } from "../states";

export const labReducer = handleActions<ILabModel, any>(
  {
    // For Get lab
    [LabActionTypes.GET_LAB_REQUEST]: (state, action) => ({
      ...state,
    }),
    [LabActionTypes.GET_LAB_SUCCESS]: (state, action) => ({
      ...state,
      LabData: action.payload.LabData,
      totalRecords: action.payload.totalRecords,
    }),
    [LabActionTypes.GET_LAB_FAILED]: (state, action) => ({
      ...state,
      isError: true,
    }),
    // For Add lab
    [LabActionTypes.ADD_LAB_REQUEST]: (state, action) => ({
      ...state,
    }),
    
    [LabActionTypes.ADD_LAB_FAILED]: (state, action) => ({
      ...state,
    }),

    // For View Sub Admin
    [LabActionTypes.VIEW_LAB_REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [LabActionTypes.VIEW_LAB_SUCCESS]: (state, action) => ({
      ...state,
      labView: action.payload.labView,
      isLoading: false,
    }),
    [LabActionTypes.VIEW_LAB_FAILED]: (state, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),
      // For Edit LAB 
      [LabActionTypes.EDIT_LAB_REQUEST]: (state, action) => ({
        ...state,
        isLoading: true,
      }),
      [LabActionTypes.EDIT_LAB_FAILED]: (state, action) => ({
        ...state,
        isLoading: false,
        isError: true,
      }),

    // For Status  Lab
    [LabActionTypes.STATUS_LAB_REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [LabActionTypes.STATUS_LAB_SUCCESS]: (state, action) => ({
      ...state,
      LabData: action.payload,
      isLoading: false,
    }),
    [ LabActionTypes.STATUS_LAB_FAILED]: (state, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),
    // For  Delete Lab
    [LabActionTypes.DELETE_LAB_REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [LabActionTypes.DELETE_LAB_SUCCESS]: (state, action) => ({
      ...state,
      LabData: action.payload,
      isLoading: false,
    }),
    [ LabActionTypes.DELETE_LAB_FAILED]: (state, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),
    //For bulk action
    [LabActionTypes.BULK_LAB_REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [LabActionTypes.BULK_LAB_SUCCESS]: (state, action) => ({
      ...state,
      LabData: action.payload,
      isLoading: false,
    }),
    [ LabActionTypes.BULK_LAB_FAILED]: (state, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),
  }, 
  labInitialState
);
