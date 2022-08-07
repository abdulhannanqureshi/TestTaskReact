import { createLogic } from "redux-logic";
import { toast } from "react-toastify";
import { ApiHelper } from "../helper/ApiHelper";
import { ApiRoutes, AppRoutes } from "../config";
import { SettingActionTypes, showLoader, hideLoader, settingInfoSuccess, settingInfoFailed, redirectTo, updateSettingSuccess, updateSettingFailed } from "../actions";

let toastId: any = null;



const viewSetting = createLogic({
  type: SettingActionTypes.SETTING_INFO_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.VIEW_SETTING.service,
      ApiRoutes.VIEW_SETTING.url,
      ApiRoutes.VIEW_SETTING.method,
      ApiRoutes.VIEW_SETTING.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        settingInfoSuccess({
          settingInfo: response.data.data
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(settingInfoFailed());
      done();
    }
  }
});


const updateSetting = createLogic({
  type: SettingActionTypes.UPDATE_SETTING_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.UPDATE_SETTING.service,
      ApiRoutes.UPDATE_SETTING.url,
      ApiRoutes.UPDATE_SETTING.method,
      ApiRoutes.UPDATE_SETTING.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        updateSettingSuccess({
          settingInfo: response.data.data
        })
      );
      dispatch(redirectTo({
        path:AppRoutes.SETTING
      }))
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(updateSettingFailed());
      done();
    }
  }
});

export const settingLogics = [viewSetting, updateSetting];
