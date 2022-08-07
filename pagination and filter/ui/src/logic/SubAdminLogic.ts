import { createLogic } from "redux-logic";
import { toast } from "react-toastify";
import { ApiHelper } from "../helper/ApiHelper";
import { ApiRoutes, AppRoutes } from "../config";
import {
  redirectTo,
  showLoader,
  hideLoader,
  SubAdminActionTypes,
  getSubAdminSuccess,
  getSubAdminFailed,
  addSubAdminFailed,
  viewSubAdminSuccess,
  viewSubAdminFailed,
  editSubAdminFailed,
  deleteSubAdminSuccess,
  deleteSubAdminFailed,
  bulkActionSubAdminFailed,
} from "../actions";
import { IRootState } from "../interfaces";
import fileDownload from "js-file-download";

let toastId: any = null;

// For Get Corporate
const getSubAdmin = createLogic({
  type: SubAdminActionTypes.GET_SUB_ADMIN_REQUEST,
  async process(data, dispatch: any, done) {
    const { action }: any = data;
    dispatch(showLoader());
    let params = action.payload;
    for (const property in params) {
      if (!params[property]) delete params[property];
    }
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.GET_SUB_ADMIN.service,
      ApiRoutes.GET_SUB_ADMIN.url,
      ApiRoutes.GET_SUB_ADMIN.method,
      ApiRoutes.GET_SUB_ADMIN.authenticate,
      params,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      // Store for search and pagination changes show on table
      dispatch(
        getSubAdminSuccess({
          subAdminData: response.data.data,
          totalRecords: response.data.totalRecords,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(getSubAdminFailed());
      done();
    }
  },
});

// For Add Sub Admin
const addSubAdmin = createLogic({
  type: SubAdminActionTypes.ADD_SUB_ADMIN_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    // Create Form Data for upload image
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.Add_SUB_ADMIN.service,
      ApiRoutes.Add_SUB_ADMIN.url,
      ApiRoutes.Add_SUB_ADMIN.method,
      ApiRoutes.Add_SUB_ADMIN.authenticate,
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
          path: AppRoutes.SUB_ADMIN,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(addSubAdminFailed());
      done();
    }
  },
});

// For View Single Sub Admin
const viewSubAdmin = createLogic({
  type: SubAdminActionTypes.VIEW_SUB_ADMIN_REQUEST,
  async process(data, dispatch: any, done) {
    const { action }: any = data;
    dispatch(showLoader());

    let params = action.payload;
    for (const property in params) {
      if (!params[property]) delete params[property];
    }
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.VIEW_SUB_ADMIN.service,
      ApiRoutes.VIEW_SUB_ADMIN.url.replace(":id", action.payload),
      ApiRoutes.VIEW_SUB_ADMIN.method,
      ApiRoutes.VIEW_SUB_ADMIN.authenticate,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        viewSubAdminSuccess({
          subAdminView: response.data.data,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(viewSubAdminFailed());
      done();
    }
  },
});

// For Edit Sub Admin
const editSubAdmin = createLogic({
  type: SubAdminActionTypes.EDIT_SUB_ADMIN_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const { id, props, ...restParams } = action.payload;
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.EDIT_SUB_ADMIN.service,
      ApiRoutes.EDIT_SUB_ADMIN.url.replace(":id", id),
      ApiRoutes.EDIT_SUB_ADMIN.method,
      ApiRoutes.EDIT_SUB_ADMIN.authenticate,
      undefined,
      restParams
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      props.history.goBack();
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(editSubAdminFailed());
      done();
    }
  },
});

// For Delete Sub Admin
const deleteSubAdmin = createLogic({
  type: SubAdminActionTypes.DELETE_SUB_ADMIN_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.DELETE_SUB_ADMIN.service,
      ApiRoutes.DELETE_SUB_ADMIN.url.replace(":id", action.payload),
      ApiRoutes.DELETE_SUB_ADMIN.method,
      ApiRoutes.DELETE_SUB_ADMIN.authenticate,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      const state: IRootState = data.getState() as IRootState;
      let subAdminData: any = state.subAdminReducer.subAdminData;
      let index: any = subAdminData.findIndex(
        (e: any) => e._id === action.payload
      );
      subAdminData.splice(index, 1);
      dispatch(deleteSubAdminSuccess(subAdminData));
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        deleteSubAdminFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});

// For Status Sub Admin
const statusSubAdmin = createLogic({
  type: SubAdminActionTypes.STATUS_SUB_ADMIN_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.STATUS_SUB_ADMIN.service,
      ApiRoutes.STATUS_SUB_ADMIN.url.replace(":id", action.payload.id),
      ApiRoutes.STATUS_SUB_ADMIN.method,
      ApiRoutes.STATUS_SUB_ADMIN.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      const state: IRootState = data.getState() as IRootState;
      let subAdminData: any = state.subAdminReducer.subAdminData;
      let index: any = subAdminData.findIndex(
        (e: any) => e._id === action.payload.id
      );
      subAdminData[index].isActive = action.payload.isActive;
      dispatch(deleteSubAdminSuccess(subAdminData));
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        deleteSubAdminFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});
// Download CSV File
const reportDownloadSubAdmin = createLogic({
  type: SubAdminActionTypes.REPORT_SUB_ADMIN_REQUEST,
  async process(data, dispatch: any, done) {
    const { action }: any = data;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.REPORT_SUB_ADMIN.service,
      ApiRoutes.REPORT_SUB_ADMIN.url,
      ApiRoutes.REPORT_SUB_ADMIN.method,
      ApiRoutes.REPORT_SUB_ADMIN.authenticate,
      undefined,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success("Report downloaded successfully");
      }
      fileDownload(response.data, "sub_admin_report.csv");
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error("Report download failed");
      }
      dispatch(hideLoader());
    }
  },
});

// For Bulk Sub Admin Action
const bulkSubAdminAction = createLogic({
  type: SubAdminActionTypes.BULK_ACTION_SUB_ADMIN_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.BULK_SUB_ADMIN.service,
      ApiRoutes.BULK_SUB_ADMIN.url,
      ApiRoutes.BULK_SUB_ADMIN.method,
      ApiRoutes.BULK_SUB_ADMIN.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      const state: IRootState = data.getState() as IRootState;
      let subAdminData: any = state.subAdminReducer.subAdminData;
      let successData: any;
      if (action.payload.type === "Active") {
        successData = subAdminData.map((e: any) => ({
          ...e,
          isActive: action.payload.ids.includes(e._id) ? true : e.isActive,
        }));
      }
      if (action.payload.type === "Deactive") {
        successData = subAdminData.map((e: any) => ({
          ...e,
          isActive: action.payload.ids.includes(e._id) ? false : e.isActive,
        }));
      }
      if (action.payload.type === "Delete") {
        successData = subAdminData.filter(
          (e: any) => !action.payload.ids.includes(e._id)
        );
      }
      dispatch(deleteSubAdminSuccess(successData));
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        bulkActionSubAdminFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});

export const SubAdminLogics = [
  getSubAdmin,
  addSubAdmin,
  viewSubAdmin,
  editSubAdmin,
  deleteSubAdmin,
  statusSubAdmin,
  reportDownloadSubAdmin,
  bulkSubAdminAction,
];
