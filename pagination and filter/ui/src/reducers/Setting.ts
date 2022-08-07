import { handleActions } from 'redux-actions';
import { SettingActionTypes } from './../actions';
import { ISettingModel } from '../interfaces';
import { SettingInitialState } from '../states';

export const settingReducer = handleActions<ISettingModel, any>(
  {
    /**
     * Setting Details
     */
    [SettingActionTypes.SETTING_INFO_REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [SettingActionTypes.SETTING_INFO_SUCCESS]: (state, action) => ({
      ...state,
      settingInfo: action.payload.settingInfo,
      isLoading: false,
    }),
    [SettingActionTypes.SETTING_INFO_FAILED]: (state, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),

    /**
     * Update setting
     */
    [SettingActionTypes.UPDATE_SETTING_REQUEST]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
    [SettingActionTypes.UPDATE_SETTING_SUCCESS]: (state, action) => ({
      ...state,
      isSuccess: false,
     settingInfo: action.payload.settingInfo,
    }),
    [SettingActionTypes.UPDATE_SETTING_FAILED]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
  },
  SettingInitialState,
);
