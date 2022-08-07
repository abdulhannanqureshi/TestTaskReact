import { createLogic } from "redux-logic";
import { toast } from "react-toastify";
import { ApiHelper } from "../helper/ApiHelper";
import { ApiRoutes, AppRoutes } from "../config";
import {
  ModuleActionTypes,
  showLoader,
  hideLoader,
  getModuleSuccess,
  getModuleFailed,
  addModuleSuccess,
  addModuleFailed,
  moduleInfoSuccess,
  moduleInfoFailed,
  redirectTo,
  updateModuleSuccess,
  updateModuleFailed,
  getModuleRequest,
  moduleDeleteSuccess,
  moduleDeleteFailed,
  moduleStatusSuccess,
  moduleStatusFailed,
  bulkModuleActionSuccess,
  bulkModuleActionFailed,
  TalentLmsApiSuccess,
  TalentLmsApiFailed
} from "../actions";
import { IRootState } from "../interfaces";

let toastId: any = null;

const getModules = createLogic({
  type: ModuleActionTypes.GET_MODULE_REQUEST,
  async process(data, dispatch: any, done) {
    const { action }: any = data;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.GET_MODULE.service,
      ApiRoutes.GET_MODULE.url,
      ApiRoutes.GET_MODULE.method,
      ApiRoutes.GET_MODULE.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        getModuleSuccess({
          currentPage: action.payload.skip,
          moduleData: response.data.data,
          totalRecords: response.data.totalRecords,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(getModuleFailed());
      done();
    }
  },
});

const addModule = createLogic({
  type: ModuleActionTypes.ADD_MODULE_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.ADD_MODULE.service,
      ApiRoutes.ADD_MODULE.url,
      ApiRoutes.ADD_MODULE.method,
      ApiRoutes.ADD_MODULE.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        addModuleSuccess({
          moduleData: response.data.data,
        })
      );
      dispatch(
        redirectTo({
          path: AppRoutes.MODULE,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(addModuleFailed());
      done();
    }
  },
});

const updateModule = createLogic({
  type: ModuleActionTypes.UPDATE_MODULE_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.UPDATE_MODULE.service,
      ApiRoutes.UPDATE_MODULE.url.replace(":id", action.payload._id),
      ApiRoutes.UPDATE_MODULE.method,
      ApiRoutes.UPDATE_MODULE.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        updateModuleSuccess({
          moduleInfo: response.data.data,
        })
      );
      dispatch(
        redirectTo({
          path: AppRoutes.MODULE,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(updateModuleFailed());
      done();
    }
  },
});

const viewModule = createLogic({
  type: ModuleActionTypes.MODULE_INFO_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.VIEW_MODULE.service,
      ApiRoutes.VIEW_MODULE.url.replace(":id", action.payload.id),
      ApiRoutes.VIEW_MODULE.method,
      ApiRoutes.VIEW_MODULE.authenticate,
      undefined,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        moduleInfoSuccess({
          moduleInfo: response.data.data,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(moduleInfoFailed());
      done();
    }
  },
});

/**
|--------------------------------------------------
| Delete Module 
|--------------------------------------------------
*/

const deleteModule = createLogic({
  type: ModuleActionTypes.MODULE_DELET_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.DELETE_MODULE.service,
      ApiRoutes.DELETE_MODULE.url.replace(":id", action.payload.id),
      ApiRoutes.DELETE_MODULE.method,
      ApiRoutes.DELETE_MODULE.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
        dispatch(moduleDeleteSuccess());
      }
      dispatch(
        getModuleSuccess({
          moduleData: response.data.data,
          totalRecords: response.data.totalRecords,
        })
      );
      dispatch(
        getModuleRequest({
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
        moduleDeleteFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});

/**
|--------------------------------------------------
| Update module status
|--------------------------------------------------
*/

const updateModuleStatus = createLogic({
  type: ModuleActionTypes.UPDATE_MODULE_STATUS_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.UPDATE_MODULE_STATUS.service,
      ApiRoutes.UPDATE_MODULE_STATUS.url.replace(":id", action.payload.id),
      ApiRoutes.UPDATE_MODULE_STATUS.method,
      ApiRoutes.UPDATE_MODULE_STATUS.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
        dispatch(moduleStatusSuccess());
      }
      const state: IRootState = data.getState() as IRootState;
      dispatch(
        moduleInfoSuccess({
          moduleData: {
            ...state.moduleReducer.moduleInfo,
            isActive: action.payload.isActive,
          },
        })
      );
      dispatch(
        getModuleRequest({
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
        moduleStatusFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});
const bulkModuleAction = createLogic({
  type: ModuleActionTypes.BULK_MODULE_ACTION_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.MODULE_BULK_ACTION.service,
      ApiRoutes.MODULE_BULK_ACTION.url,
      ApiRoutes.MODULE_BULK_ACTION.method,
      ApiRoutes.MODULE_BULK_ACTION.authenticate,
      undefined,
      action.payload,
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
        dispatch(bulkModuleActionSuccess(""));
      }
      const state: IRootState = data.getState() as IRootState;
      dispatch(
        moduleInfoSuccess({
          userData: {
            ...state.userReducer.userInfo,
            isActive: action.payload.isActive,
          },
        })
      );
      dispatch(
        getModuleRequest({
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
        bulkModuleActionFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  }, 
}); 
const talentlmsapi = createLogic({
  type: ModuleActionTypes.TALENT_LMS_API_REQUEST,
  async process(data, dispatch: any, done) {

    const { action }: any = data;
    // dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.TALENT_LMS_API.service,
      ApiRoutes.TALENT_LMS_API.url,
      ApiRoutes.TALENT_LMS_API.method,
      ApiRoutes.TALENT_LMS_API.authenticate,
      action.payload,
      undefined
    );
    // console.log(response,"this is response")
    if (response && !response.isError) {
      toastId = toast.success(response.messages[0]);
      dispatch(
        getModuleRequest({
          skip: action.payload.skip,
          limit: action.payload.limit,
        })
      );
      // dispatch(
      //   TalentLmsApiSuccess(response.data)
      // );
      done();
    } else {
      console.log(response);
     
      done();
    }
  }
});
export const moduleLogics = [
  getModules,
  addModule,
  viewModule,
  updateModule,
  deleteModule,
  updateModuleStatus,
  bulkModuleAction,
  talentlmsapi
];
