import { createLogic } from "redux-logic";
import { toast } from "react-toastify";
import { ApiHelper } from "../helper/ApiHelper";
import { ApiRoutes, AppRoutes } from "../config";
import {
  PressReleaseCategoryActionTypes,
  showLoader,
  hideLoader,
  getPressReleaseCategorySuccess,
  getPressReleaseCategoryFailed,
  addPressReleaseCategorySuccess,
  addPressReleaseCategoryFailed,
  pressReleaseCategoryInfoSuccess,
  pressReleaseCategoryInfoFailed,
  redirectTo,
  updatePressReleaseCategorySuccess,
  updatePressReleaseCategoryFailed,
  getPressReleaseCategoryRequest,
  pressReleaseCategoryStatusSuccess,
  pressReleaseCategoryStatusFailed,
  pressReleaseCategoryDeleteSuccess,
  pressReleaseCategoryDeleteFailed,
} from "../actions";
import { IRootState } from "../interfaces";

let toastId: any = null;

const getPressReleaseCategory = createLogic({
  type: PressReleaseCategoryActionTypes.GET_PRESS_RELEASE_CATEGORY_REQUEST,
  async process(data, dispatch: any, done) {
    const { action }: any = data;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.GET_PRESS_RELEASE_CATEGORY.service,
      ApiRoutes.GET_PRESS_RELEASE_CATEGORY.url,
      ApiRoutes.GET_PRESS_RELEASE_CATEGORY.method,
      ApiRoutes.GET_PRESS_RELEASE_CATEGORY.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        getPressReleaseCategorySuccess({
          pressReleaseCategoryData: response.data.data,
          totalRecords: response.data.totalRecords,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(getPressReleaseCategoryFailed());
      done();
    }
  },
});

const addPressReleaseCategory = createLogic({
  type: PressReleaseCategoryActionTypes.ADD_PRESS_RELEASE_CATEGORY_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.ADD_PRESS_RELEASE_CATEGORY.service,
      ApiRoutes.ADD_PRESS_RELEASE_CATEGORY.url,
      ApiRoutes.ADD_PRESS_RELEASE_CATEGORY.method,
      ApiRoutes.ADD_PRESS_RELEASE_CATEGORY.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        addPressReleaseCategorySuccess({
          pressReleaseCategoryData: response.data.data,
        })
      );
      dispatch(
        redirectTo({
          path: AppRoutes.PRESS_RELEASE_CATEGORY,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(addPressReleaseCategoryFailed());
      done();
    }
  },
});

const updatePressReleaseCategory = createLogic({
  type: PressReleaseCategoryActionTypes.UPDATE_PRESS_RELEASE_CATEGORY_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.UPDATE_PRESS_RELEASE_CATEGORY.service,
      ApiRoutes.UPDATE_PRESS_RELEASE_CATEGORY.url.replace(
        ":id",
        action.payload._id
      ),
      ApiRoutes.UPDATE_PRESS_RELEASE_CATEGORY.method,
      ApiRoutes.UPDATE_PRESS_RELEASE_CATEGORY.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        updatePressReleaseCategorySuccess({
          pressReleaseCategoryInfo: response.data.data,
        })
      );
      dispatch(
        redirectTo({
          path: AppRoutes.PRESS_RELEASE_CATEGORY,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(updatePressReleaseCategoryFailed());
      done();
    }
  },
});

const viewPressReleaseCategory = createLogic({
  type: PressReleaseCategoryActionTypes.PRESS_RELEASE_CATEGORY_INFO_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.VIEW_PRESS_RELEASE_CATEGORY.service,
      ApiRoutes.VIEW_PRESS_RELEASE_CATEGORY.url.replace(
        ":id",
        action.payload.id
      ),
      ApiRoutes.VIEW_PRESS_RELEASE_CATEGORY.method,
      ApiRoutes.VIEW_PRESS_RELEASE_CATEGORY.authenticate,
      undefined,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        pressReleaseCategoryInfoSuccess({
          pressReleaseCategoryInfo: response.data.data,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(pressReleaseCategoryInfoFailed());
      done();
    }
  },
});

/**
|--------------------------------------------------
| Update press release category status
|--------------------------------------------------
*/

const updatePressReleaseCategoryStatus = createLogic({
  type: PressReleaseCategoryActionTypes.UPDATE_PRESS_RELEASE_CATEGORY_STATUS_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.UPDATE_PRESS_RELEASE_CATEGORY_STATUS.service,
      ApiRoutes.UPDATE_PRESS_RELEASE_CATEGORY_STATUS.url.replace(
        ":id",
        action.payload.id
      ),
      ApiRoutes.UPDATE_PRESS_RELEASE_CATEGORY_STATUS.method,
      ApiRoutes.UPDATE_PRESS_RELEASE_CATEGORY_STATUS.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
        dispatch(pressReleaseCategoryStatusSuccess());
      }
      const state: IRootState = data.getState() as IRootState;
      dispatch(
        pressReleaseCategoryInfoSuccess({
          pressReleaseCategoryData: {
            ...state.pressReleaseCategoryReducer.pressReleaseCategoryInfo,
            isActive: action.payload.isActive,
          },
        })
      );
      dispatch(
        getPressReleaseCategoryRequest({
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
        pressReleaseCategoryStatusFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});

/**
|--------------------------------------------------
| Delete press release category
|--------------------------------------------------
*/

const deletePressReleaseCategory = createLogic({
  type: PressReleaseCategoryActionTypes.PRESS_RELEASE_CATEGORY_DELETE_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    if (action.payload === undefined) return false;

    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.DELETE_PRESS_RELEASE_CATEGORY.service,
      ApiRoutes.DELETE_PRESS_RELEASE_CATEGORY.url.replace(
        ":id",
        action.payload.id
      ),
      ApiRoutes.DELETE_PRESS_RELEASE_CATEGORY.method,
      ApiRoutes.DELETE_PRESS_RELEASE_CATEGORY.authenticate,
      undefined,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
        dispatch(pressReleaseCategoryDeleteSuccess());
      }
      dispatch(
        getPressReleaseCategorySuccess({
          pressReleaseCategoryData: response.data.data,
          totalRecords: response.data.totalRecords,
        })
      );
      dispatch(
        getPressReleaseCategoryRequest({
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
        pressReleaseCategoryDeleteFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});

export const pressReleaseCategoryLogics = [
  getPressReleaseCategory,
  addPressReleaseCategory,
  viewPressReleaseCategory,
  updatePressReleaseCategory,
  deletePressReleaseCategory,
  updatePressReleaseCategoryStatus,
];
