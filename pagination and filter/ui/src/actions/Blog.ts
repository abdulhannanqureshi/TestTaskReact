import { createAction } from 'redux-actions';

export enum BlogActionTypes {
  GET_BLOG_REQUEST = 'BLOG Requested!',
  GET_BLOG_SUCCESS = 'BLOG data fetch successfully!',
  GET_BLOG_FAILED = 'BLOG request failed!',
  ADD_BLOG_REQUEST = "Add BLOG Request!",
  ADD_BLOG_SUCCESS = "Add BLOG Succesfully!",
  ADD_BLOG_FAILED = "Add BLOG Request Failed!",
  BLOG_INFO_REQUEST = "BLOG info Request!",
  BLOG_INFO_SUCCESS = "BLOG Info Request!",
  BLOG_INFO_FAILED = "BLOG Info Failed!",
  BLOG_DELET_REQUEST = "BLOG delet Request!",
  BLOG_DELET_SUCCESS = "BLOG delet Request!",
  BLOG_DELET_FAILED = "BLOG delet Failed!",
  UPDATE_BLOG_REQUEST = "Update BLOG Request!",
  UPDATE_BLOG_SUCCESS = "Update BLOG Success!",
  UPDATE_BLOG_FAILED = "Update BLOG request Failed!",
  UPDATE_BLOG_STATUS_REQUEST = 'UPDATE BLOG success Requested!',
  UPDATE_BLOG_STATUS_SUCCESS = 'UPDATE BLOG_STATUS successfully!',
  UPDATE_BLOG_STATUS_FAILED = 'UPDATE BLOG_STATUS failed!',
  BULK_BLOG_ACTION_REQUEST = 'BULK BLOG ACTION Requested!',
  BULK_BLOG_ACTION_SUCCESS = 'BULK BLOG ACTION data fetch successfully!',
  BULK_BLOG_ACTION_FAILED = 'BULK BLOG ACTION request failed!',
}

// get Blog list
export const getBlogRequest = createAction(
  BlogActionTypes.GET_BLOG_REQUEST,
);
export const getBlogSuccess = createAction<any>(
  BlogActionTypes.GET_BLOG_SUCCESS,
);
export const getBlogFailed = createAction(
  BlogActionTypes.GET_BLOG_FAILED,
);

/**
 * Add Blog
 */
export const addBlogRequest = createAction(
  BlogActionTypes.ADD_BLOG_REQUEST,
);
export const addBlogSuccess = createAction(
  BlogActionTypes.ADD_BLOG_SUCCESS,
);
export const addBlogFailed = createAction(
  BlogActionTypes.ADD_BLOG_FAILED,
);

/**
 * Blog Informations
 */
export const blogInfoRequest = createAction(
  BlogActionTypes.BLOG_INFO_REQUEST,
);
export const blogInfoSuccess = createAction(
  BlogActionTypes.BLOG_INFO_SUCCESS,
);
export const blogInfoFailed = createAction(
  BlogActionTypes.BLOG_INFO_FAILED,
);

/**
 * Update Blog
 */

export const updateBlogRequest = createAction(
  BlogActionTypes.UPDATE_BLOG_REQUEST,
);
export const updateBlogSuccess = createAction(
  BlogActionTypes.UPDATE_BLOG_SUCCESS,
);
export const updateBlogFailed = createAction(
  BlogActionTypes.UPDATE_BLOG_FAILED,
);

/**
 * Delete Blog
 */

 export const blogDeleteRequest = createAction(
  BlogActionTypes.BLOG_DELET_REQUEST,
);
export const blogDeleteSuccess = createAction(
  BlogActionTypes.BLOG_DELET_SUCCESS,
);
export const blogDeleteFailed = createAction(
  BlogActionTypes.BLOG_DELET_FAILED,
);

/**
 * Blog Status 
 */
export const blogStatusRequest = createAction(
  BlogActionTypes.UPDATE_BLOG_STATUS_REQUEST,
);
export const blogStatusSuccess = createAction(
  BlogActionTypes.UPDATE_BLOG_STATUS_SUCCESS,
);
export const blogStatusFailed = createAction(
  BlogActionTypes.UPDATE_BLOG_STATUS_FAILED,
);
// get corporation list
export const bulkBlogActionRequest = createAction(
  BlogActionTypes.BULK_BLOG_ACTION_REQUEST,
);
export const bulkBlogActionSuccess = createAction<any>( 
  BlogActionTypes.BULK_BLOG_ACTION_SUCCESS,
);
export const bulkBlogActionFailed = createAction(
  BlogActionTypes.BULK_BLOG_ACTION_FAILED,
);  