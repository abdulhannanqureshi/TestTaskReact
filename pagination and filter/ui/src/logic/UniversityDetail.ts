import { createLogic } from "redux-logic";
import { toast } from "react-toastify";
import { ApiHelper } from "../helper/ApiHelper";
import { ApiRoutes, AppRoutes } from "../config";
import {
  UniversityActionTypes,
  addUniversitySuccess,
  showLoader,
  redirectTo,
  hideLoader,
  addUniversityFailed,
  getUniversityListSuccess,
  getUniversityListFailed,
  updateUniversityFailed,
  updateUniversitySuccess,
  deleteUniversityFailed,
  deleteUniversitySuccess,
  getUniversityListRequest,
  updateUniversityStatusFailed,
  updateUniversityStatusSuccess,
  getUniversityInfoSuccess,
  getUniversityInfoFailed

} from "../actions";
import { IRootState } from "../interfaces";

let toastId: any = null;

const getUniversityListing = createLogic({
  type: UniversityActionTypes.GET_UNIVERSITY_REQUEST,
  async process(data, dispatch: any, done) {
    const { action }: any = data;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.GET_UNIVERSITY_NAME.service,
      ApiRoutes.GET_UNIVERSITY_NAME.url,
      ApiRoutes.GET_UNIVERSITY_NAME.method,
      ApiRoutes.GET_UNIVERSITY_NAME.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      console.log(response.data.data,"this is required response")
      dispatch(
        getUniversityListSuccess({
          currentPage: action.payload.skip,
          universityData: response.data.data,
          totalRecords: response.data.totalRecords,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(getUniversityListFailed());
      done();
    }
  },
});

const addUniversity = createLogic({
  type: UniversityActionTypes.ADD_UNIVERSITY_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    console.log("message pta hai")
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.ADD_UNIVERSITY_NAME.service,
      ApiRoutes.ADD_UNIVERSITY_NAME.url,
      ApiRoutes.ADD_UNIVERSITY_NAME.method,
      ApiRoutes.ADD_UNIVERSITY_NAME.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        addUniversitySuccess({
          userData: response.data.data,
        })
      );
      dispatch(
        redirectTo({
          path: AppRoutes.UNIVERSITY,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch( addUniversityFailed());
      done();
    }
  },
});
const updateUniversity = createLogic({
  type: UniversityActionTypes.EDIT_UNIVERSITY_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const { id, ...restParams } = action.payload;
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.EDIT_UNIVERSITY.service,
      ApiRoutes.EDIT_UNIVERSITY.url.replace(":id",id),
      ApiRoutes.EDIT_UNIVERSITY.method,
      ApiRoutes.EDIT_UNIVERSITY.authenticate,
      undefined,
      restParams
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        updateUniversitySuccess({
          universityInfo: response.data.data,
        })
      );

     action.payload.props.history.goBack();
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(updateUniversityFailed());
      done();
    }
  },
});
const deleteUniversity = createLogic({
  type:UniversityActionTypes.DELETE_UNIVERSITY_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.DELETE_UNIVERSITY.service,
      ApiRoutes.DELETE_UNIVERSITY.url.replace(":id", action.payload.id),
      ApiRoutes.DELETE_UNIVERSITY.method,
      ApiRoutes.DELETE_UNIVERSITY.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
        dispatch(deleteUniversitySuccess(""));
      }
      dispatch(
        getUniversityListSuccess({
          currentPage: action.payload.skip,
          universityData: response.data.data,
          totalRecords: response.data.totalRecords,
        })
      );
      dispatch(
        getUniversityListRequest({
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
        deleteUniversityFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});

const updateUniversityStatus = createLogic({
  type: UniversityActionTypes.UPDATE_UNIVERSITY_STATUS_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.UPDATE_UNIVERSITY_STATUS.service,
      ApiRoutes.UPDATE_UNIVERSITY_STATUS.url.replace(":id", action.payload.id),
      ApiRoutes.UPDATE_UNIVERSITY_STATUS.method,
      ApiRoutes.UPDATE_UNIVERSITY_STATUS.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
        dispatch(updateUniversityStatusSuccess(""));
      }
      const state: IRootState = data.getState() as IRootState;
      dispatch(
        getUniversityInfoSuccess({
          userData: {
            ...state.userReducer.userInfo,
            isActive: action.payload.isActive,
          },
        })
      );
      dispatch(
        getUniversityListRequest({
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
        updateUniversityStatusFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});
const viewUniversity = createLogic({
  type:UniversityActionTypes.VIEW_SPECIFIC_UNIVERSITY__REQUEST,

  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.VIEW_UNIVERSITY.service,
      ApiRoutes.VIEW_UNIVERSITY.url.replace(":id", action.payload.id),
      ApiRoutes.VIEW_UNIVERSITY.method,
      ApiRoutes.VIEW_UNIVERSITY.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        getUniversityInfoSuccess({
          universityInfo: response.data.data,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(getUniversityInfoFailed());
      done();
    }
  },
});



export const universityDetailsLogics = [
  getUniversityListing,
  addUniversity,
  updateUniversity,
  deleteUniversity ,
  updateUniversityStatus,
  viewUniversity

];
