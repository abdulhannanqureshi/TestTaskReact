import { createLogic } from "redux-logic";
import { toast } from "react-toastify";
import { ApiHelper } from "../helper/ApiHelper";
import { ApiRoutes, AppRoutes } from "../config";
import {
  BlogActionTypes,
  showLoader,
  hideLoader,
  getBlogSuccess,
  getBlogFailed,
  addBlogSuccess,
  addBlogFailed,
  blogInfoSuccess,
  blogInfoFailed,
  redirectTo,
  updateBlogSuccess,
  updateBlogFailed,
  getBlogRequest,
  blogStatusSuccess,
  blogStatusFailed,
  blogDeleteSuccess,
  blogDeleteFailed,
  bulkBlogActionSuccess,
  bulkBlogActionFailed
} from "../actions";
import { IRootState } from "../interfaces";

let toastId: any = null;

const getBlog = createLogic({
  type: BlogActionTypes.GET_BLOG_REQUEST,
  async process(data, dispatch: any, done) {
    const { action }: any = data;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.GET_BLOG.service,
      ApiRoutes.GET_BLOG.url,
      ApiRoutes.GET_BLOG.method,
      ApiRoutes.GET_BLOG.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        getBlogSuccess({
          blogData: response.data.data,
          totalRecords: response.data.totalRecords,
        })
      );
      done(); 
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(getBlogFailed());
      done();
    }
  },
});

const addBlog = createLogic({
  type: BlogActionTypes.ADD_BLOG_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().UploadImage(
      ApiRoutes.ADD_BLOG.service,
      ApiRoutes.ADD_BLOG.url,
      ApiRoutes.ADD_BLOG.method,
      // ApiRoutes.ADD_BLOG.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        addBlogSuccess({
          blogData: response.data.data,
        })
      );
      dispatch(
        redirectTo({
          path: AppRoutes.BLOG,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(addBlogFailed());
      done();
    }
  },
});

const updateBlog = createLogic({
  type: BlogActionTypes.UPDATE_BLOG_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().UploadImage(
      ApiRoutes.UPDATE_BLOG.service,
      ApiRoutes.UPDATE_BLOG.url.replace(":id", action.payload._id),
      ApiRoutes.UPDATE_BLOG.method,
      // ApiRoutes.UPDATE_BLOG.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        updateBlogSuccess({
          blogInfo: response.data.data,
        })
      );
      dispatch(
        redirectTo({
          path: AppRoutes.BLOG,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(updateBlogFailed());
      done();
    }
  },
});

const viewBlog = createLogic({
  type: BlogActionTypes.BLOG_INFO_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.VIEW_BLOG.service,
      ApiRoutes.VIEW_BLOG.url.replace(":id", action.payload.id),
      ApiRoutes.VIEW_BLOG.method,
      ApiRoutes.VIEW_BLOG.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        blogInfoSuccess({
          blogInfo: response.data.data,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(blogInfoFailed());
      done();
    }
  },
});

/**
|--------------------------------------------------
| Update Blog Status
|--------------------------------------------------
*/

const updateBlogStatus = createLogic({
  type: BlogActionTypes.UPDATE_BLOG_STATUS_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.UPDATE_BLOG_STATUS.service,
      ApiRoutes.UPDATE_BLOG_STATUS.url.replace(":id", action.payload.id),
      ApiRoutes.UPDATE_BLOG_STATUS.method,
      ApiRoutes.UPDATE_BLOG_STATUS.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
        dispatch(blogStatusSuccess());
      }
      const state: IRootState = data.getState() as IRootState;
      dispatch(
        blogInfoSuccess({
          blogData: {
            ...state.blogReducer.blogInfo,
            isActive: action.payload.isActive,
          },
        })
      );
      dispatch(
        getBlogRequest({
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
        blogStatusFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});

/**
|--------------------------------------------------
| Delete Blog
|--------------------------------------------------
*/

const deleteBlog = createLogic({
  type: BlogActionTypes.BLOG_DELET_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    if (action.payload === undefined) return false;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.DELETE_BLOG.service,
      ApiRoutes.DELETE_BLOG.url.replace(":id", action.payload.id),
      ApiRoutes.DELETE_BLOG.method,
      ApiRoutes.DELETE_BLOG.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
        dispatch(blogDeleteSuccess());
      }
      dispatch(
        getBlogSuccess({
          blogData: response.data.data,
          totalRecords: response.data.totalRecords,
        })
      );
      dispatch(
        getBlogRequest({
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
        blogDeleteFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});

const bulkBlogAction = createLogic({
  type: BlogActionTypes.BULK_BLOG_ACTION_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.BLOG_BULK_ACTION.service,
      ApiRoutes.BLOG_BULK_ACTION.url,
      ApiRoutes.BLOG_BULK_ACTION.method,
      ApiRoutes.BLOG_BULK_ACTION.authenticate,
      undefined,
      action.payload,
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
        dispatch(bulkBlogActionSuccess(""));
      }
      const state: IRootState = data.getState() as IRootState;
      dispatch(
        blogInfoSuccess({
          userData: {
            ...state.userReducer.userInfo,
            isActive: action.payload.isActive,
          },
        })
      );
      dispatch(
        getBlogRequest({
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
        bulkBlogActionFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  }, 
}); 
export const blogLogics = [
  getBlog,
  addBlog,
  viewBlog,
  updateBlog,
  deleteBlog,
  updateBlogStatus,
  bulkBlogAction
]; 
 