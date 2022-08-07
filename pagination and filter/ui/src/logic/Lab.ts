import { createLogic } from "redux-logic";
import { toast } from "react-toastify";
import { ApiHelper } from "../helper/ApiHelper";
import { ApiRoutes, AppRoutes } from "../config";
import {
  showLoader,
  hideLoader,
  redirectTo,
  LabActionTypes,
  addLabRequest,
  addLabSuccess,
  addLabFailed,
  getLabSuccess,
  getLabFailed,
  statusLabFailed,
  statusLabSuccess,
  deleteLabSuccess,
  deleteLabFailed,
  viewLabSuccess,
  viewLabFailed,
  editLabFailed,
  BulkLabSuccess,
  BulkLabFailed

} from "../actions";
import { IRootState } from "../interfaces";

let toastId: any = null;

// For Get Lab
const getLabs = createLogic({
  type: LabActionTypes.GET_LAB_REQUEST,
  async process(data, dispatch: any, done) {
    const { action }: any = data;
    dispatch(showLoader());
    let params = action.payload;
    for (const property in params) {
      if (!params[property]) delete params[property];
    }
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.GET_LAB.service,
      ApiRoutes.GET_LAB.url,
      ApiRoutes.GET_LAB.method,
      ApiRoutes.GET_LAB.authenticate,
      params,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      // Store for search and pagination changes show on table
      dispatch(
        getLabSuccess({
          LabData: response.data.data,
          totalRecords: response.data.totalRecords,
        }
        )
      ); 
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(getLabFailed());
      done();
    }
  },
});

// For Add Corporate
const addLab = createLogic({
  type: LabActionTypes.ADD_LAB_REQUEST,
  async process(data, dispatch: any, done) {
    
    const action: any = data.action;
    dispatch(showLoader());
    let formData = new FormData();
    for (const property in action.payload) {
      formData.append(property, action.payload[property]);
    }
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.ADD_LAB.service,
      ApiRoutes.ADD_LAB.url,
      ApiRoutes.ADD_LAB.method,
      ApiRoutes.ADD_LAB.authenticate,
      undefined,
      formData
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        redirectTo({
          path: AppRoutes.LAB,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(addLabFailed());
      done();
    }
  },
});
//For status change
const statusChangeLab = createLogic({
  type: LabActionTypes.STATUS_LAB_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.STATUS_LAB.service,
      ApiRoutes.STATUS_LAB.url.replace(":id", action.payload.id),
      ApiRoutes.STATUS_LAB.method,
      ApiRoutes.STATUS_LAB.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      const state: IRootState = data.getState() as IRootState;
      let LabData: any = state.labReducer.LabData;  

      let index: any = LabData.findIndex(
        (e: any) => e._id === action.payload.id
      );
      LabData[index].isActive = action.payload.isActive;
      dispatch(statusLabSuccess(LabData));
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        statusLabFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});

// For View Single Labs
const viewLab = createLogic({
  type: LabActionTypes.VIEW_LAB_REQUEST,
  async process(data, dispatch: any, done) {
    const { action }: any = data;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.VIEW_LAB.service,
      ApiRoutes.VIEW_LAB.url.replace(":id", action.payload),
      ApiRoutes.VIEW_LAB.method,
      ApiRoutes.VIEW_LAB.authenticate,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        viewLabSuccess({
          labView: response.data.data,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(viewLabFailed());
      done();
    }
  },
});
// For Edit labs
const editLab = createLogic({
  type: LabActionTypes.EDIT_LAB_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const { id, props, ...restParams } = action.payload;
    let formData = new FormData();
    for (const property in restParams) {
      formData.append(property, restParams[property]);
    }
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.EDIT_LAB.service,
      ApiRoutes.EDIT_LAB.url.replace(":id", id),
      ApiRoutes.EDIT_LAB.method,
      ApiRoutes.EDIT_LAB.authenticate,
      undefined,
      formData
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
      dispatch(editLabFailed());
      done();
    }
  },
});

// For Delete Our Team
const deleteLabs = createLogic({
  type: LabActionTypes.DELETE_LAB_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.DELETE_LAB.service,
      ApiRoutes.DELETE_LAB.url.replace(":id", action.payload),
      ApiRoutes.DELETE_LAB.method,
      ApiRoutes.DELETE_LAB.authenticate,
      undefined
    ); 
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      const state: IRootState = data.getState() as IRootState;
      let LabData: any = state.labReducer.LabData;
      let index: any = LabData.findIndex((e: any) => e._id === action.payload);
      LabData.splice(index, 1);
      dispatch(deleteLabSuccess(LabData));
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        deleteLabFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});
// For Bulk Team Action
const bulkLab = createLogic({
  type:LabActionTypes.BULK_LAB_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.BULK_LAB.service,
      ApiRoutes.BULK_LAB.url,
      ApiRoutes.BULK_LAB.method,
      ApiRoutes.BULK_LAB.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      const state: IRootState = data.getState() as IRootState;
      let LabData: any = state.labReducer.LabData;
      let successData: any;
      if (action.payload.type === "Active") {
        successData = LabData.map((e: any) => ({
          ...e,
          isActive: action.payload.ids.includes(e._id) ? true : e.isActive,
        }));
      }
      if (action.payload.type === "Deactive") {
        successData = LabData.map((e: any) => ({
          ...e,
          isActive: action.payload.ids.includes(e._id) ? false : e.isActive,
        }));
      }
      if (action.payload.type === "Delete") {
        successData = LabData.filter(
          (e: any) => !action.payload.ids.includes(e._id)
        );
      }
      dispatch(BulkLabSuccess(successData));
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        BulkLabFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});

export const addLabLogics = [
  getLabs,
  addLab,
  statusChangeLab,
  deleteLabs,
  viewLab,
  editLab,
  bulkLab
];
