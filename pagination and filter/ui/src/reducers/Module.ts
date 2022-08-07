import { handleActions } from 'redux-actions';
import { ModuleActionTypes } from './../actions';
import { IModuleModel } from '../interfaces';
import { ModuleInitialState } from '../states';

export const moduleReducer = handleActions<IModuleModel, any>(
  {
    [ModuleActionTypes.GET_MODULE_REQUEST]: (state = ModuleInitialState, action) => ({
      ...state,
      isLoading: true,
    }),
    [ModuleActionTypes.GET_MODULE_SUCCESS]: (state = ModuleInitialState, action) => ({
      ...state,
      currentPage: action.payload.currentPage,
      moduleData: action.payload.moduleData,
      totalRecords: action.payload.totalRecords,
      isLoading: false,
    }),

    [ModuleActionTypes.TALENT_LMS_API_SUCCESS]: (state = ModuleInitialState, action) => ({
      ...state,
      talentmoduledata: action.payload.moduleArray
  
    }),
    [ModuleActionTypes.GET_MODULE_FAILED]: (state = ModuleInitialState, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),

    /**
     * Add Student Reducer
     */
    [ModuleActionTypes.ADD_MODULE_REQUEST]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
    [ModuleActionTypes.ADD_MODULE_SUCCESS]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
    [ModuleActionTypes.ADD_MODULE_FAILED]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),

    /**
     * Student Details
     */
    [ModuleActionTypes.MODULE_INFO_REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [ModuleActionTypes.MODULE_INFO_SUCCESS]: (state, action) => ({
      ...state,
      moduleInfo: action.payload.moduleInfo,
      isLoading: false,
    }),
    [ModuleActionTypes.MODULE_INFO_FAILED]: (state, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),

    /**
     * Update Student
     */
    [ModuleActionTypes.UPDATE_MODULE_REQUEST]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
    [ModuleActionTypes.UPDATE_MODULE_SUCCESS]: (state, action) => ({
      ...state,
      isSuccess: false,
     moduleInfo: action.payload.moduleInfo,
    }),
    [ModuleActionTypes.UPDATE_MODULE_FAILED]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
  },
  ModuleInitialState,
);
