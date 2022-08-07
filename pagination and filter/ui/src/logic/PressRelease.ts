import { createLogic } from "redux-logic";
import { toast } from "react-toastify";
import { ApiHelper } from "../helper/ApiHelper";
import { ApiRoutes, AppRoutes } from "../config";
import {
  PressReleaseActionTypes,
  showLoader, 
  hideLoader,
  getPressReleaseSuccess,
  getPressReleaseFailed,
  addPressReleaseSuccess,
  addPressReleaseFailed,
  pressReleaseInfoSuccess,
  pressReleaseInfoFailed,
  redirectTo,
  updatePressReleaseSuccess,
  updatePressReleaseFailed,
  getPressReleaseRequest,
  pressReleaseStatusSuccess,
  pressReleaseStatusFailed,
  pressReleaseDeleteSuccess,
  pressReleaseDeleteFailed,
  bulkPressReleaseActionFailed,
  bulkPressReleaseActionSuccess
} from "../actions";
import { IRootState } from "../interfaces";

let toastId: any = null;

const getPressRelease = createLogic({
  type: PressReleaseActionTypes.GET_PRESS_RELEASE_REQUEST,
  async process(data, dispatch: any, done) {
    const { action }: any = data;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.GET_PRESS_RELEASE.service,
      ApiRoutes.GET_PRESS_RELEASE.url, 
      ApiRoutes.GET_PRESS_RELEASE.method,
      ApiRoutes.GET_PRESS_RELEASE.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        getPressReleaseSuccess({
          pressReleaseData: response.data.data,
          totalRecords: response.data.totalRecords,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(getPressReleaseFailed());
      done();
    }
  },
});

const addPressRelease = createLogic({
  type: PressReleaseActionTypes.ADD_PRESS_RELEASE_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().UploadImage(
      ApiRoutes.ADD_PRESS_RELEASE.service,
      ApiRoutes.ADD_PRESS_RELEASE.url,
      ApiRoutes.ADD_PRESS_RELEASE.method,
      // ApiRoutes.ADD_PRESS_RELEASE.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        addPressReleaseSuccess({
          pressReleaseData: response.data.data,
        })
      );
      dispatch(
        redirectTo({
          path: AppRoutes.PRESS_RELEASE,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(addPressReleaseFailed());
      done();
    }
  },
});

const updatePressRelease = createLogic({
  type: PressReleaseActionTypes.UPDATE_PRESS_RELEASE_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().UploadImage(
      ApiRoutes.UPDATE_PRESS_RELEASE.service,
      ApiRoutes.UPDATE_PRESS_RELEASE.url.replace(":id", action.payload._id),
      ApiRoutes.UPDATE_PRESS_RELEASE.method,
      // ApiRoutes.UPDATE_PRESS_RELEASE.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        updatePressReleaseSuccess({
          pressReleaseInfo: response.data.data,
        })
      );
      dispatch(
        redirectTo({
          path: AppRoutes.PRESS_RELEASE,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(updatePressReleaseFailed());
      done();
    }
  },
});

const viewPressRelease = createLogic({
  type: PressReleaseActionTypes.PRESS_RELEASE_INFO_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.VIEW_PRESS_RELEASE.service,
      ApiRoutes.VIEW_PRESS_RELEASE.url.replace(":id", action.payload.id),
      ApiRoutes.VIEW_PRESS_RELEASE.method,
      ApiRoutes.VIEW_PRESS_RELEASE.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        pressReleaseInfoSuccess({
          pressReleaseInfo: response.data.data,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(pressReleaseInfoFailed());
      done();
    }
  },
});

/**
|--------------------------------------------------
| Update press release status
|--------------------------------------------------
*/

const updatePressReleaseStatus = createLogic({
  type: PressReleaseActionTypes.UPDATE_PRESS_RELEASE_STATUS_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.UPDATE_PRESS_RELEASE_STATUS.service,
      ApiRoutes.UPDATE_PRESS_RELEASE_STATUS.url.replace(
        ":id",
        action.payload.id
      ),
      ApiRoutes.UPDATE_PRESS_RELEASE_STATUS.method,
      ApiRoutes.UPDATE_PRESS_RELEASE_STATUS.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
        dispatch(pressReleaseStatusSuccess());
      }
      const state: IRootState = data.getState() as IRootState;
      dispatch(
        pressReleaseInfoSuccess({
          pressReleaseData: {
            ...state.pressReleaseReducer.pressReleaseInfo,
            isActive: action.payload.isActive,
          },
        })
      );
      dispatch(
        getPressReleaseRequest({
          skip: action.payload.skip,
          limit: action.payload.limit,
        })
      );
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        pressReleaseStatusFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});

/**
|--------------------------------------------------
| Delete press release
|--------------------------------------------------
*/

const deletePressRelease = createLogic({
  type: PressReleaseActionTypes.PRESS_RELEASE_DELETE_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    if (action.payload === undefined) return false;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.DELETE_PRESS_RELEASE.service,
      ApiRoutes.DELETE_PRESS_RELEASE.url.replace(":id", action.payload.id),
      ApiRoutes.DELETE_PRESS_RELEASE.method,
      ApiRoutes.DELETE_PRESS_RELEASE.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
        dispatch(pressReleaseDeleteSuccess());
      }
      dispatch(
        getPressReleaseSuccess({
          pressReleaseData: response.data.data,
          totalRecords: response.data.totalRecords,
        })
      );
      dispatch(
        getPressReleaseRequest({
          skip: action.payload.skip,
          limit: action.payload.limit,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        pressReleaseDeleteFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});
const bulkPressReleaseAction = createLogic({
  type: PressReleaseActionTypes.BULK_PRESS_RELEASE_ACTION_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.PRESS_RELEASE_BULK_ACTION.service,
      ApiRoutes.PRESS_RELEASE_BULK_ACTION.url,
      ApiRoutes.PRESS_RELEASE_BULK_ACTION.method,
      ApiRoutes.PRESS_RELEASE_BULK_ACTION.authenticate,
      undefined,
      action.payload,
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
        dispatch(bulkPressReleaseActionSuccess(""));
      }
      const state: IRootState = data.getState() as IRootState;
      dispatch(
        pressReleaseInfoSuccess({
          userData: {
            ...state.userReducer.userInfo,
            isActive: action.payload.isActive,
          },
        })
      );
      dispatch(
        getPressReleaseRequest({
          skip: action.payload.skip,
          limit: action.payload.limit,
        })
      );
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        bulkPressReleaseActionFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});

export const pressReleaseLogics = [
  getPressRelease,
  addPressRelease,
  viewPressRelease,
  updatePressRelease,
  deletePressRelease,
  updatePressReleaseStatus,
  bulkPressReleaseAction
];
