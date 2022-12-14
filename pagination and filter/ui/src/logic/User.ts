import { createLogic } from "redux-logic";
import { toast } from "react-toastify";
import { ApiHelper } from "../helper/ApiHelper";
import { ApiRoutes, AppRoutes } from "../config";
import fileDownload from "js-file-download"
import {
  UserActionTypes,
  showLoader,
  hideLoader,
  getUserSuccess,
  getUserFailed,
  addUserSuccess,
  addUserFailed,
  userInfoSuccess,
  userInfoFailed,
  redirectTo,
  updateUserSuccess,
  updateUserFailed,
  getUserRequest,
  userStatusSuccess,
  userStatusFailed,
  userDeleteSuccess,
  userDeleteFailed,
  getUniversitySuccess,
  getUniversityFailed,
  getCorporationSuccess,
  getCorporationFailed,
  bulkUserActionSuccess,
  bulkUserActionFailed,
  getUserReportSuccess,
} from "../actions";
import { IRootState } from "../interfaces";

let toastId: any = null;

const getUsers = createLogic({
  type: UserActionTypes.GET_USER_REQUEST,
  async process(data, dispatch: any, done) {
    const { action }: any = data;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.GET_USER.service,
      ApiRoutes.GET_USER.url,
      ApiRoutes.GET_USER.method,
      ApiRoutes.GET_USER.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        getUserSuccess({
          currentPage: action.payload.skip,
          userData: response.data.data,
          totalRecords: response.data.totalRecords,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(getUserFailed());
      done();
    }
  },
});

const addUser = createLogic({
  type: UserActionTypes.ADD_USER_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.ADD_USER.service,
      ApiRoutes.ADD_USER.url,
      ApiRoutes.ADD_USER.method,
      ApiRoutes.ADD_USER.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        addUserSuccess({
          userData: response.data.data,
        })
      );
      dispatch(
        redirectTo({
          path: AppRoutes.USER,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(addUserFailed());
      done();
    }
  },
});

const updateUser = createLogic({
  type: UserActionTypes.UPDATE_USER_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.UPDATE_USER.service,
      ApiRoutes.UPDATE_USER.url.replace(":id", action.payload._id),
      ApiRoutes.UPDATE_USER.method,
      ApiRoutes.UPDATE_USER.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        updateUserSuccess({
          userInfo: response.data.data,
        })
      );
      dispatch(
        redirectTo({
          path: AppRoutes.USER,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(updateUserFailed());
      done();
    }
  },
});

const viewUser = createLogic({
  type: UserActionTypes.USER_INFO_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.VIEW_USER.service,
      ApiRoutes.VIEW_USER.url.replace(":id", action.payload.id),
      ApiRoutes.VIEW_USER.method,
      ApiRoutes.VIEW_USER.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        userInfoSuccess({
          userInfo: response.data.data,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(userInfoFailed());
      done();
    }
  },
});

/**
|--------------------------------------------------
| Update Student Status
|--------------------------------------------------
*/

const updateUserStatus = createLogic({
  type: UserActionTypes.UPDATE_USER_STATUS_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.UPDATE_USER_STATUS.service,
      ApiRoutes.UPDATE_USER_STATUS.url.replace(":id", action.payload.id),
      ApiRoutes.UPDATE_USER_STATUS.method,
      ApiRoutes.UPDATE_USER_STATUS.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
        dispatch(userStatusSuccess());
      }
      const state: IRootState = data.getState() as IRootState;
      dispatch(
        userInfoSuccess({
          userData: {
            ...state.userReducer.userInfo,
            isActive: action.payload.isActive,
          },
        })
      );
      dispatch(   
        getUserRequest({
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
        userStatusFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});

/**
|--------------------------------------------------
| Delete User
|--------------------------------------------------
*/

const deleteUser = createLogic({
  type: UserActionTypes.USER_DELET_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.DELETE_USER.service,
      ApiRoutes.DELETE_USER.url.replace(":id", action.payload.id),
      ApiRoutes.DELETE_USER.method,
      ApiRoutes.DELETE_USER.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
        dispatch(userDeleteSuccess());
      }
      dispatch(
        getUserSuccess({
          userData: response.data.data,
          totalRecords: response.data.totalRecords,
        })
      );
      dispatch(
        getUserRequest({
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
        userDeleteFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});

const getUniversity = createLogic({
  type: UserActionTypes.GET_UNIVERSITY_REQUEST,
  async process(data, dispatch: any, done) {
    const { action }: any = data;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.GET_UNIVERSITY.service,
      ApiRoutes.GET_UNIVERSITY.url,
      ApiRoutes.GET_UNIVERSITY.method,
      ApiRoutes.GET_UNIVERSITY.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        getUniversitySuccess({
          universityData: response.data.data,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(getUniversityFailed());
      done();
    }
  },
});

const getCorporation = createLogic({
  type: UserActionTypes.GET_CORPORATION_REQUEST,
  async process(data, dispatch: any, done) {
    const { action }: any = data;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.GET_CORPORATION.service,
      ApiRoutes.GET_CORPORATION.url,
      ApiRoutes.GET_CORPORATION.method,
      ApiRoutes.GET_CORPORATION.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        getCorporationSuccess({
          corporateData: response.data.data,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(getCorporationFailed());
      done();
    }
  },
});

/**
|--------------------------------------------------
| Update Student Status
|--------------------------------------------------
*/

const bulkUserAction = createLogic({
  type: UserActionTypes.BULK_USER_ACTION_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.USER_BULK_ACTION.service,
      ApiRoutes.USER_BULK_ACTION.url,
      ApiRoutes.USER_BULK_ACTION.method,
      ApiRoutes.USER_BULK_ACTION.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
        dispatch(bulkUserActionSuccess(""));
      }
      const state: IRootState = data.getState() as IRootState;
      dispatch(
        userInfoSuccess({
          userData: {
            ...state.userReducer.userInfo,
            isActive: action.payload.isActive,
          },
        })
      );
      dispatch(
        getUserRequest({
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
        bulkUserActionFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});
const getUserReport = createLogic({
  type: UserActionTypes.GET_USER_REPORT_REQUEST,
  async process(data, dispatch: any, done) {
    const { action }: any = data;
    // dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.GET_USER_REPORTS.service,
      ApiRoutes.GET_USER_REPORTS.url,
      ApiRoutes.GET_USER_REPORTS.method,
      ApiRoutes.GET_USER_REPORTS.authenticate,
      undefined,
      undefined
    );
    if (response && !response.isError) {
      fileDownload(response.data, "coinifide_user.csv");
      // dispatch(
      //   getUserReportSuccess(response)
      // );
      done();
    } else {
      console.log(response);

      done();
    }
  },
});
export const userLogics = [
  getUsers,
  addUser,
  viewUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  getUniversity,
  getCorporation,
  bulkUserAction,
  getUserReport
];
