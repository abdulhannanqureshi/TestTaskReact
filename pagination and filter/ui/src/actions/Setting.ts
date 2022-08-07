import { createAction } from 'redux-actions';

export enum SettingActionTypes {
  SETTING_INFO_REQUEST = "SETTING info Request!",
  SETTING_INFO_SUCCESS = "SETTING Info Request!",
  SETTING_INFO_FAILED = "SETTING Info Failed!",
  UPDATE_SETTING_REQUEST = "Update SETTING Request!",
  UPDATE_SETTING_SUCCESS = "Update SETTING Success!",
  UPDATE_SETTING_FAILED = "Update SETTING request Failed!",
}

/**
 * Setting Informations
 */
export const settingInfoRequest = createAction(
  SettingActionTypes.SETTING_INFO_REQUEST,
);
export const settingInfoSuccess = createAction(
  SettingActionTypes.SETTING_INFO_SUCCESS,
);
export const settingInfoFailed = createAction(
  SettingActionTypes.SETTING_INFO_FAILED,
);

/**
 * Update setting
 */

export const updateSettingRequest = createAction(
  SettingActionTypes.UPDATE_SETTING_REQUEST,
);
export const updateSettingSuccess = createAction(
  SettingActionTypes.UPDATE_SETTING_SUCCESS,
);
export const updateSettingFailed = createAction(
  SettingActionTypes.UPDATE_SETTING_FAILED,
);