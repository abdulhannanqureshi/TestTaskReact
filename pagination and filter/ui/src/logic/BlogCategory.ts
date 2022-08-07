import { createLogic } from "redux-logic";
import { toast } from "react-toastify";
import { ApiHelper } from "../helper/ApiHelper";
import { ApiRoutes, AppRoutes } from "../config";
import {
  BlogCategoryActionTypes,
  showLoader,
  hideLoader,
  getBlogCategorySuccess,
  getBlogCategoryFailed,
  addBlogCategorySuccess,
  addBlogCategoryFailed,
  blogCategoryInfoSuccess,
  blogCategoryInfoFailed,
  redirectTo,
  updateBlogCategorySuccess,
  updateBlogCategoryFailed,
  getBlogCategoryRequest,
  blogCategoryStatusSuccess,
  blogCategoryStatusFailed,
  blogCategoryDeleteSuccess,
  blogCategoryDeleteFailed,
} from "../actions";
import { IRootState } from "../interfaces";

let toastId: any = null;

const getBlogCategory = createLogic({
  type: BlogCategoryActionTypes.GET_BLOG_CATEGORY_REQUEST,
  async process(data, dispatch: any, done) {
    const { action }: any = data;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.GET_BLOG_CATEGORY.service,
      ApiRoutes.GET_BLOG_CATEGORY.url,
      ApiRoutes.GET_BLOG_CATEGORY.method,
      ApiRoutes.GET_BLOG_CATEGORY.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        getBlogCategorySuccess({
          blogCategoryData: response.data.data,
          totalRecords: response.data.totalRecords,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(getBlogCategoryFailed());
      done();
    }
  },
});

const addBlogCategory = createLogic({
  type: BlogCategoryActionTypes.ADD_BLOG_CATEGORY_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.ADD_BLOG_CATEGORY.service,
      ApiRoutes.ADD_BLOG_CATEGORY.url,
      ApiRoutes.ADD_BLOG_CATEGORY.method,
      ApiRoutes.ADD_BLOG_CATEGORY.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        addBlogCategorySuccess({
          blogCategoryData: response.data.data,
        })
      );
      dispatch(
        redirectTo({
          path: AppRoutes.BLOG_CATEGORY,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(addBlogCategoryFailed());
      done();
    }
  },
});

const updateBlogCategory = createLogic({
  type: BlogCategoryActionTypes.UPDATE_BLOG_CATEGORY_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.UPDATE_BLOG_CATEGORY.service,
      ApiRoutes.UPDATE_BLOG_CATEGORY.url.replace(":id", action.payload._id),
      ApiRoutes.UPDATE_BLOG_CATEGORY.method,
      ApiRoutes.UPDATE_BLOG_CATEGORY.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        updateBlogCategorySuccess({
          blogCategoryInfo: response.data.data,
        })
      );
      dispatch(
        redirectTo({
          path: AppRoutes.BLOG_CATEGORY,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(updateBlogCategoryFailed());
      done();
    }
  },
});

const viewBlogCategory = createLogic({
  type: BlogCategoryActionTypes.BLOG_CATEGORY_INFO_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.VIEW_BLOG_CATEGORY.service,
      ApiRoutes.VIEW_BLOG_CATEGORY.url.replace(":id", action.payload.id),
      ApiRoutes.VIEW_BLOG_CATEGORY.method,
      ApiRoutes.VIEW_BLOG_CATEGORY.authenticate,
      undefined,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        blogCategoryInfoSuccess({
          blogCategoryInfo: response.data.data,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(blogCategoryInfoFailed());
      done();
    }
  },
});

/**
|--------------------------------------------------
| Update Blog Category Status
|--------------------------------------------------
*/

const updateBlogCategoryStatus = createLogic({
  type: BlogCategoryActionTypes.UPDATE_BLOG_CATEGORY_STATUS_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.UPDATE_BLOG_CATEGORY_STATUS.service,
      ApiRoutes.UPDATE_BLOG_CATEGORY_STATUS.url.replace(
        ":id",
        action.payload.id
      ),
      ApiRoutes.UPDATE_BLOG_CATEGORY_STATUS.method,
      ApiRoutes.UPDATE_BLOG_CATEGORY_STATUS.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
        dispatch(blogCategoryStatusSuccess());
      }
      const state: IRootState = data.getState() as IRootState;
      dispatch(
        blogCategoryInfoSuccess({
          blogCategoryData: {
            ...state.blogCategoryReducer.blogCategoryInfo,
            isActive: action.payload.isActive,
          },
        })
      );
      dispatch(
        getBlogCategoryRequest({
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
        blogCategoryStatusFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});

/**
|--------------------------------------------------
| Delete Blog Category
|--------------------------------------------------
*/

const deleteBlogCategory = createLogic({
  type: BlogCategoryActionTypes.BLOG_CATEGORY_DELET_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    if (action.payload === undefined) return false;

    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.DELETE_BLOG_CATEGORY.service,
      ApiRoutes.DELETE_BLOG_CATEGORY.url.replace(":id", action.payload.id),
      ApiRoutes.DELETE_BLOG_CATEGORY.method,
      ApiRoutes.DELETE_BLOG_CATEGORY.authenticate,
      undefined,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
        dispatch(blogCategoryDeleteSuccess());
      }
      dispatch(
        getBlogCategorySuccess({
          blogCategoryData: response.data.data,
          totalRecords: response.data.totalRecords,
        })
      );
      dispatch(
        getBlogCategoryRequest({
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
        blogCategoryDeleteFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});

export const blogCategoryLogics = [
  getBlogCategory,
  addBlogCategory,
  viewBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  updateBlogCategoryStatus,
];
