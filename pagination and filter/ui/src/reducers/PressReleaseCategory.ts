import { handleActions } from 'redux-actions';
import { PressReleaseCategoryActionTypes } from './../actions';
import { IPressReleaseCategoryModel } from '../interfaces';
import { PressReleaseCategoryInitialState } from '../states';

export const pressReleaseCategoryReducer = handleActions<IPressReleaseCategoryModel, any>(
  {
    [PressReleaseCategoryActionTypes.GET_PRESS_RELEASE_CATEGORY_REQUEST]: (state = PressReleaseCategoryInitialState, action) => ({
      ...state,
      isLoading: true,
    }),
    [PressReleaseCategoryActionTypes.GET_PRESS_RELEASE_CATEGORY_SUCCESS]: (state = PressReleaseCategoryInitialState, action) => ({
      ...state,
      pressReleaseCategoryData: action.payload.pressReleaseCategoryData,
      totalRecords: action.payload.totalRecords,
      isLoading: false,
    }),
    [PressReleaseCategoryActionTypes.GET_PRESS_RELEASE_CATEGORY_FAILED]: (state = PressReleaseCategoryInitialState, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),

    /**
     * Add press release reducer
     */
    [PressReleaseCategoryActionTypes.ADD_PRESS_RELEASE_CATEGORY_REQUEST]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
    [PressReleaseCategoryActionTypes.ADD_PRESS_RELEASE_CATEGORY_SUCCESS]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
    [PressReleaseCategoryActionTypes.ADD_PRESS_RELEASE_CATEGORY_FAILED]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),

    /**
     * Student Details
     */
    [PressReleaseCategoryActionTypes.PRESS_RELEASE_CATEGORY_INFO_REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [PressReleaseCategoryActionTypes.PRESS_RELEASE_CATEGORY_INFO_SUCCESS]: (state, action) => ({
      ...state,
      pressReleaseCategoryInfo: action.payload.pressReleaseCategoryInfo,
      isLoading: false,
    }),
    [PressReleaseCategoryActionTypes.PRESS_RELEASE_CATEGORY_INFO_FAILED]: (state, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),

    /**
     * Update Student
     */
    [PressReleaseCategoryActionTypes.UPDATE_PRESS_RELEASE_CATEGORY_REQUEST]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
    [PressReleaseCategoryActionTypes.UPDATE_PRESS_RELEASE_CATEGORY_SUCCESS]: (state, action) => ({
      ...state,
      isSuccess: false,
     pressReleaseCategoryInfo: action.payload.pressReleaseCategoryInfo,
    }),
    [PressReleaseCategoryActionTypes.UPDATE_PRESS_RELEASE_CATEGORY_FAILED]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
  },
  PressReleaseCategoryInitialState,
);
