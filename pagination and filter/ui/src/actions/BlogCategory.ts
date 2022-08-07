import { createAction } from 'redux-actions';

export enum BlogCategoryActionTypes {
  GET_BLOG_CATEGORY_REQUEST = 'BlogCategory Requested!',
  GET_BLOG_CATEGORY_SUCCESS = 'BlogCategory data fetch successfully!',
  GET_BLOG_CATEGORY_FAILED = 'BlogCategory request failed!',
  ADD_BLOG_CATEGORY_REQUEST = "Add BlogCategory Request!",
  ADD_BLOG_CATEGORY_SUCCESS = "Add BlogCategory Succesfully!",
  ADD_BLOG_CATEGORY_FAILED = "Add BlogCategory Request Failed!",
  BLOG_CATEGORY_INFO_REQUEST = "BlogCategory info Request!",
  BLOG_CATEGORY_INFO_SUCCESS = "BlogCategory Info Request!",
  BLOG_CATEGORY_INFO_FAILED = "BlogCategory Info Failed!",
  BLOG_CATEGORY_DELET_REQUEST = "BlogCategory delet Request!",
  BLOG_CATEGORY_DELET_SUCCESS = "BlogCategory delet Request!",
  BLOG_CATEGORY_DELET_FAILED = "BlogCategory delet Failed!",
  UPDATE_BLOG_CATEGORY_REQUEST = "Update BlogCategory Request!",
  UPDATE_BLOG_CATEGORY_SUCCESS = "Update BlogCategory Success!",
  UPDATE_BLOG_CATEGORY_FAILED = "Update BlogCategory request Failed!",
  UPDATE_BLOG_CATEGORY_STATUS_REQUEST = 'UPDATE BlogCategory success Requested!',
  UPDATE_BLOG_CATEGORY_STATUS_SUCCESS = 'UPDATE BlogCategory_STATUS successfully!',
  UPDATE_BLOG_CATEGORY_STATUS_FAILED = 'UPDATE BlogCategory_STATUS failed!',
}

// get blog category list
export const getBlogCategoryRequest = createAction(
  BlogCategoryActionTypes.GET_BLOG_CATEGORY_REQUEST,
);
export const getBlogCategorySuccess = createAction<any>(
  BlogCategoryActionTypes.GET_BLOG_CATEGORY_SUCCESS,
);
export const getBlogCategoryFailed = createAction(
  BlogCategoryActionTypes.GET_BLOG_CATEGORY_FAILED,
);

/**
 * Add Blog Category
 */
export const addBlogCategoryRequest = createAction(
  BlogCategoryActionTypes.ADD_BLOG_CATEGORY_REQUEST,
);
export const addBlogCategorySuccess = createAction(
  BlogCategoryActionTypes.ADD_BLOG_CATEGORY_SUCCESS,
);
export const addBlogCategoryFailed = createAction(
  BlogCategoryActionTypes.ADD_BLOG_CATEGORY_FAILED,
);

/**
 * Blog Category Informations
 */
export const blogCategoryInfoRequest = createAction(
  BlogCategoryActionTypes.BLOG_CATEGORY_INFO_REQUEST,
);
export const blogCategoryInfoSuccess = createAction(
  BlogCategoryActionTypes.BLOG_CATEGORY_INFO_SUCCESS,
);
export const blogCategoryInfoFailed = createAction(
  BlogCategoryActionTypes.BLOG_CATEGORY_INFO_FAILED,
);

/**
 * Update Blog Category
 */

export const updateBlogCategoryRequest = createAction(
  BlogCategoryActionTypes.UPDATE_BLOG_CATEGORY_REQUEST,
);
export const updateBlogCategorySuccess = createAction(
  BlogCategoryActionTypes.UPDATE_BLOG_CATEGORY_SUCCESS,
);
export const updateBlogCategoryFailed = createAction(
  BlogCategoryActionTypes.UPDATE_BLOG_CATEGORY_FAILED,
);

/**
 * Delete Blog Category
 */

 export const blogCategoryDeleteRequest = createAction(
  BlogCategoryActionTypes.BLOG_CATEGORY_DELET_REQUEST,
);
export const blogCategoryDeleteSuccess = createAction(
  BlogCategoryActionTypes.BLOG_CATEGORY_DELET_SUCCESS,
);
export const blogCategoryDeleteFailed = createAction(
  BlogCategoryActionTypes.BLOG_CATEGORY_DELET_FAILED,
);

/**
 * Blog Category Status 
 */
export const blogCategoryStatusRequest = createAction(
  BlogCategoryActionTypes.UPDATE_BLOG_CATEGORY_STATUS_REQUEST,
);
export const blogCategoryStatusSuccess = createAction(
  BlogCategoryActionTypes.UPDATE_BLOG_CATEGORY_STATUS_SUCCESS,
);
export const blogCategoryStatusFailed = createAction(
  BlogCategoryActionTypes.UPDATE_BLOG_CATEGORY_STATUS_FAILED,
);