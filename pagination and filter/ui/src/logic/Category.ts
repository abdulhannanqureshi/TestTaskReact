import { createLogic } from "redux-logic";
import { toast } from "react-toastify";
import { ApiHelper } from "../helper/ApiHelper";
import { ApiRoutes, AppRoutes } from "../config";
import {
  CategoryActionTypes,
  showLoader,
  hideLoader,
  getCategorySuccess,
  getCategoryFailed,
  addCategorySuccess,
  addCategoryFailed,
  categoryInfoSuccess,
  categoryInfoFailed,
  redirectTo,
  updateCategorySuccess,
  updateCategoryFailed,
  getCategoryRequest,
  categoryDeleteSuccess,
  categoryDeleteFailed,
  categoryStatusSuccess,
  categoryStatusFailed,
  bulkCategoryActionSuccess,
  bulkCategoryActionFailed,
} from "../actions";
import { IRootState } from "../interfaces";

let toastId: any = null;

const getCategory = createLogic({
  type: CategoryActionTypes.GET_CATEGORY_REQUEST,
  async process(data, dispatch: any, done) {
    const { action }: any = data;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.GET_CATEGORY.service,
      ApiRoutes.GET_CATEGORY.url,
      ApiRoutes.GET_CATEGORY.method,
      ApiRoutes.GET_CATEGORY.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        getCategorySuccess({
          currentPage: action.payload.skip,
          categoryData: response.data.data,
          totalRecords: response.data.totalRecords,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(getCategoryFailed());
      done();
    }
  },
});

const addCategory = createLogic({
  type: CategoryActionTypes.ADD_CATEGORY_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().UploadImage(
      ApiRoutes.ADD_CATEGORY.service,
      ApiRoutes.ADD_CATEGORY.url,
      ApiRoutes.ADD_CATEGORY.method,
      // ApiRoutes.ADD_CATEGORY.authenticate,
      action.payload,
      undefined,
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        addCategorySuccess({
          categoryData: response.data.data,
        })
      );
      dispatch(
        redirectTo({
          path: AppRoutes.CATEGORY,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(addCategoryFailed());
      done();
    }
  },
});

const updateCategory = createLogic({
  type: CategoryActionTypes.UPDATE_CATEGORY_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().UploadImage(
      ApiRoutes.UPDATE_CATEGORY.service,
      ApiRoutes.UPDATE_CATEGORY.url.replace(":id", action.payload._id),
      ApiRoutes.UPDATE_CATEGORY.method,
      // ApiRoutes.UPDATE_CATEGORY.authenticate,
      action.payload,
      undefined,
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        updateCategorySuccess({
          categoryInfo: response.data.data,
        })
      );
      dispatch(
        redirectTo({
          path: AppRoutes.CATEGORY,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(updateCategoryFailed());
      done();
    }
  },
});

const viewCategory = createLogic({
  type: CategoryActionTypes.CATEGORY_INFO_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.VIEW_CATEGORY.service,
      ApiRoutes.VIEW_CATEGORY.url.replace(":id", action.payload.id),
      ApiRoutes.VIEW_CATEGORY.method,
      ApiRoutes.VIEW_CATEGORY.authenticate,
      undefined,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        categoryInfoSuccess({
          categoryInfo: response.data.data,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(categoryInfoFailed());
      done();
    }
  },
});

/**
|--------------------------------------------------
| Delete category 
|--------------------------------------------------
*/

const deleteCategory = createLogic({
  type: CategoryActionTypes.CATEGORY_DELETE_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.DELETE_CATEGORY.service,
      ApiRoutes.DELETE_CATEGORY.url.replace(":id", action.payload.id),
      ApiRoutes.DELETE_CATEGORY.method,
      ApiRoutes.DELETE_CATEGORY.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
        dispatch(categoryDeleteSuccess());
      }
      dispatch(
        getCategorySuccess({
          categoryData: response.data.data,
          totalRecords: response.data.totalRecords,
        })
      );
      dispatch(
        getCategoryRequest({
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
        categoryDeleteFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});

/**
|--------------------------------------------------
| Update category status
|--------------------------------------------------
*/

const updateCategoryStatus = createLogic({
  type: CategoryActionTypes.UPDATE_CATEGORY_STATUS_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.UPDATE_CATEGORY_STATUS.service,
      ApiRoutes.UPDATE_CATEGORY_STATUS.url.replace(":id", action.payload.id),
      ApiRoutes.UPDATE_CATEGORY_STATUS.method,
      ApiRoutes.UPDATE_CATEGORY_STATUS.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
        dispatch(categoryStatusSuccess());
      }
      const state: IRootState = data.getState() as IRootState;
      dispatch(
        categoryInfoSuccess({
          categoryData: {
            ...state.categoryReducer.categoryInfo,
            isActive: action.payload.isActive,
          },
        })
      );
      dispatch(
        getCategoryRequest({
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
        categoryStatusFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});

const bulkCategoryAction = createLogic({
  type: CategoryActionTypes.BULK_CATEGORY_ACTION_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.CATEGORY_BULK_ACTION.service,
      ApiRoutes.CATEGORY_BULK_ACTION.url,
      ApiRoutes.CATEGORY_BULK_ACTION.method,
      ApiRoutes.CATEGORY_BULK_ACTION.authenticate,
      undefined,
      action.payload,
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
        dispatch(bulkCategoryActionSuccess(""));
      }
      const state: IRootState = data.getState() as IRootState;
      dispatch(
        categoryInfoSuccess({
          categoryData: {
            ...state.categoryReducer.categoryInfo,
            isActive: action.payload.isActive,
          },
        })
      );
      dispatch(
        getCategoryRequest({
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
        bulkCategoryActionFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});

export const categoryLogics = [
  getCategory,
  addCategory,
  viewCategory,
  updateCategory,
  deleteCategory,
  updateCategoryStatus,
  bulkCategoryAction,
];
