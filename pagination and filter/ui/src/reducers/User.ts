import { handleActions } from 'redux-actions';
import { UserActionTypes } from './../actions';
import { IUserModel } from '../interfaces';
import { UserInitialState } from '../states';

export const userReducer = handleActions<IUserModel, any>(
  {
    [UserActionTypes.GET_USER_REQUEST]: (state = UserInitialState, action) => ({
      ...state,
      isLoading: true,
    }),
    [UserActionTypes.GET_USER_SUCCESS]: (state = UserInitialState, action) => ({
      ...state,
      currentPage: action.payload.currentPage,
      userData: action.payload.userData,
      totalRecords: action.payload.totalRecords,
      isLoading: false,
    }),
    [UserActionTypes.GET_USER_REPORT_SUCCESS]: (state = UserInitialState, action) => ({
      ...state,
     userReport: action.payload.userReport,
    }),
    [UserActionTypes.GET_USER_FAILED]: (state = UserInitialState, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),

    /**
     * Add Student Reducer
     */
    [UserActionTypes.ADD_USER_REQUEST]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
    [UserActionTypes.ADD_USER_SUCCESS]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
    [UserActionTypes.ADD_USER_FAILED]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),

    /**
     * Student Details
     */
    [UserActionTypes.USER_INFO_REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [UserActionTypes.USER_INFO_SUCCESS]: (state, action) => ({
      ...state,
      userInfo: action.payload.userInfo,
      isLoading: false,
    }),
    [UserActionTypes.USER_INFO_FAILED]: (state, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),

    /**
     * Update Student
     */
    [UserActionTypes.UPDATE_USER_REQUEST]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
    [UserActionTypes.UPDATE_USER_SUCCESS]: (state, action) => ({
      ...state,
      isSuccess: false,
     userInfo: action.payload.userInfo,
    }),
    [UserActionTypes.UPDATE_USER_FAILED]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),

    [UserActionTypes.GET_UNIVERSITY_REQUEST]: (state = UserInitialState, action) => ({
      ...state,
      isLoading: true,
    }),
    [UserActionTypes.GET_UNIVERSITY_SUCCESS]: (state = UserInitialState, action) => ({
      ...state,
      universityData: action.payload.universityData,
      isLoading: false,
    }),
    [UserActionTypes.GET_UNIVERSITY_FAILED]: (state = UserInitialState, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),

    [UserActionTypes.GET_CORPORATION_REQUEST]: (state = UserInitialState, action) => ({
      ...state,
      isLoading: true,
    }),
    [UserActionTypes.GET_CORPORATION_SUCCESS]: (state = UserInitialState, action) => ({
      ...state,
      corporateData: action.payload.corporateData,
      isLoading: false,
    }),
    [UserActionTypes.GET_CORPORATION_FAILED]: (state = UserInitialState, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),
    [UserActionTypes.BULK_USER_ACTION_REQUEST]: (state = UserInitialState, action) => ({
      ...state,
      isLoading: true,
    }),
    [UserActionTypes.BULK_USER_ACTION_SUCCESS]: (state = UserInitialState, action) => ({
      ...state,
      corporateData: action.payload.corporateData,
      isLoading: false,
    }),
    [UserActionTypes.BULK_USER_ACTION_FAILED]: (state = UserInitialState, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),
  },
  UserInitialState,
);
