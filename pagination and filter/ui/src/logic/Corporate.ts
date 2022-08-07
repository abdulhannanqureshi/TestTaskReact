import { createLogic } from "redux-logic";
import { toast } from "react-toastify";
import { ApiHelper } from "../helper/ApiHelper";
import { ApiRoutes, AppRoutes } from "../config";
import {
  showLoader,
  hideLoader,
  redirectTo,
  CorporateActionTypes,
  addCorporateFailed,
  getCorporateSuccess,
  getCorporateFailed,
  statusCorporateSuccess,
  statusCorporateFailed,
  viewCorporateSuccess,
  viewCorporateFailed,
  editCorporateFailed,
} from "../actions";
import { IRootState } from "../interfaces";

let toastId: any = null;

// For Get Corporate
const getCorporate = createLogic({
  type: CorporateActionTypes.GET_CORPORATE_REQUEST,
  async process(data, dispatch: any, done) {
    const { action }: any = data;
    dispatch(showLoader());
    let params = action.payload;
    for (const property in params) {
      if (!params[property]) delete params[property];
    }
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.GET_CORPORATE.service,
      ApiRoutes.GET_CORPORATE.url,
      ApiRoutes.GET_CORPORATE.method,
      ApiRoutes.GET_CORPORATE.authenticate,
      params,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        getCorporateSuccess({
          corporateData: response.data.data,
          totalRecords: response.data.totalRecords,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(getCorporateFailed());
      done();
    }
  },
});

// For Add Corporate
const addCorporate = createLogic({
  type: CorporateActionTypes.ADD_CORPORATE_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.ADD_CORPORATE.service,
      ApiRoutes.ADD_CORPORATE.url,
      ApiRoutes.ADD_CORPORATE.method,
      ApiRoutes.ADD_CORPORATE.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        redirectTo({
          path: AppRoutes.CORPORATE,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(addCorporateFailed());
      done();
    }
  },
});
// For Status Corporate
const updateCorporateStatus = createLogic({
  type: CorporateActionTypes.STATUS_CORPORATE_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.UPDATE_CORPORATE_STATUS.service,
      ApiRoutes.UPDATE_CORPORATE_STATUS.url.replace(":id", action.payload.id),
      ApiRoutes.UPDATE_CORPORATE_STATUS.method,
      ApiRoutes.UPDATE_CORPORATE_STATUS.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      const state: IRootState = data.getState() as IRootState;
      let corporate: any = state.corporateReducer.corporateData;
      let index: any = corporate.findIndex(
        (e: any) => e._id === action.payload.id
      );
      corporate[index].isActive = action.payload.isActive;
      dispatch(statusCorporateSuccess(corporate));
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        statusCorporateFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});

// For Delete Corporate
const deleteCorporateStatus = createLogic({
  type: CorporateActionTypes.DELETE_CORPORATE_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.DELETE_CORPORATE.service,
      ApiRoutes.DELETE_CORPORATE.url.replace(":id", action.payload),
      ApiRoutes.DELETE_CORPORATE.method,
      ApiRoutes.DELETE_CORPORATE.authenticate,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      const state: IRootState = data.getState() as IRootState;
      let corporate: any = state.corporateReducer.corporateData;
      let index: any = corporate.findIndex(
        (e: any) => e._id === action.payload
      );
      corporate.splice(index, 1);
      dispatch(statusCorporateSuccess(corporate));
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        statusCorporateFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});

// For View Single Corporate
const viewCorporate = createLogic({
  type: CorporateActionTypes.VIEW_CORPORATE_REQUEST,
  async process(data, dispatch: any, done) {
    const { action }: any = data;
    dispatch(showLoader());

    let params = action.payload;
    for (const property in params) {
      if (!params[property]) delete params[property];
    }
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.VIEW_CORPORATE.service,
      ApiRoutes.VIEW_CORPORATE.url.replace(":id", action.payload),
      ApiRoutes.VIEW_CORPORATE.method,
      ApiRoutes.VIEW_CORPORATE.authenticate,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        viewCorporateSuccess({
          corporateView: response.data.data,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(viewCorporateFailed());
      done();
    }
  },
});

// For Edit Corporate
const editCorporate = createLogic({
  type: CorporateActionTypes.EDIT_CORPORATE_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const { id, ...restParams } = action.payload.form;
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.EDIT_CORPORATE.service,
      ApiRoutes.EDIT_CORPORATE.url.replace(":id", id),
      ApiRoutes.EDIT_CORPORATE.method,
      ApiRoutes.EDIT_CORPORATE.authenticate,
      undefined,
      restParams
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      action.payload.props.history.goBack();
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(editCorporateFailed());
      done();
    }
  },
});
export const addCorporateLogics = [
  addCorporate,
  getCorporate,
  updateCorporateStatus,
  deleteCorporateStatus,
  viewCorporate,
  editCorporate,
];
