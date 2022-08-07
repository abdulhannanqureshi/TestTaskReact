import { handleActions } from 'redux-actions';
import { PressReleaseActionTypes } from './../actions';
import { IPressReleaseModel } from '../interfaces';
import { PressReleaseInitialState } from '../states';

export const pressReleaseReducer = handleActions<IPressReleaseModel, any>(
  {
    [PressReleaseActionTypes.GET_PRESS_RELEASE_REQUEST]: (state = PressReleaseInitialState, action) => ({
      ...state,
      isLoading: true,
    }),
    [PressReleaseActionTypes.GET_PRESS_RELEASE_SUCCESS]: (state = PressReleaseInitialState, action) => ({
      ...state,
      pressReleaseData: action.payload.pressReleaseData,
      totalRecords: action.payload.totalRecords,
      isLoading: false,
    }),
    [PressReleaseActionTypes.GET_PRESS_RELEASE_FAILED]: (state = PressReleaseInitialState, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),

    /**
     * Add press release reducer
     */
    [PressReleaseActionTypes.ADD_PRESS_RELEASE_REQUEST]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
    [PressReleaseActionTypes.ADD_PRESS_RELEASE_SUCCESS]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
    [PressReleaseActionTypes.ADD_PRESS_RELEASE_FAILED]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),

    /**
     * Press release details
     */
    [PressReleaseActionTypes.PRESS_RELEASE_INFO_REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [PressReleaseActionTypes.PRESS_RELEASE_INFO_SUCCESS]: (state, action) => ({
      ...state,
      pressReleaseInfo: action.payload.pressReleaseInfo,
      isLoading: false,
    }),
    [PressReleaseActionTypes.PRESS_RELEASE_INFO_FAILED]: (state, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),

    /**
     * Update press release
     */
    [PressReleaseActionTypes.UPDATE_PRESS_RELEASE_REQUEST]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
    [PressReleaseActionTypes.UPDATE_PRESS_RELEASE_SUCCESS]: (state, action) => ({
      ...state,
      isSuccess: false,
     pressReleaseInfo: action.payload.pressReleaseInfo,
    }),
    [PressReleaseActionTypes.UPDATE_PRESS_RELEASE_FAILED]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
  },
  PressReleaseInitialState,
);
