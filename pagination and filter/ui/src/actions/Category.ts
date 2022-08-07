import { createAction } from 'redux-actions';

export enum CategoryActionTypes {
  GET_CATEGORY_REQUEST = 'Category Requested!',
  GET_CATEGORY_SUCCESS = 'Category data fetch successfully!',
  GET_CATEGORY_FAILED = 'Category request failed!',
  ADD_CATEGORY_REQUEST = "Add category Request!",
  ADD_CATEGORY_SUCCESS = "Add category Succesfully!",
  ADD_CATEGORY_FAILED = "Add category Request Failed!",
  CATEGORY_INFO_REQUEST = "Category info Request!",
  CATEGORY_INFO_SUCCESS = "Category Info Request!",
  CATEGORY_INFO_FAILED = "Category Info Failed!",
  CATEGORY_DELETE_REQUEST = "Category delet Request!",
  CATEGORY_DELETE_SUCCESS = "Category delet Success!",
  CATEGORY_DELETE_FAILED = "Category delet Failed!",
  UPDATE_CATEGORY_REQUEST = "Update category Request!",
  UPDATE_CATEGORY_SUCCESS = "Update category Success!",
  UPDATE_CATEGORY_FAILED = "Update category request Failed!",
  UPDATE_CATEGORY_STATUS_REQUEST = 'UPDATE category success Requested!',
  UPDATE_CATEGORY_STATUS_SUCCESS = 'UPDATE category status successfully!',
  UPDATE_CATEGORY_STATUS_FAILED = 'UPDATE category status failed!',
  BULK_CATEGORY_ACTION_REQUEST = 'BULK CATEGORY ACTION Requested!',
  BULK_CATEGORY_ACTION_SUCCESS = 'BULK CATEGORY ACTION data fetch successfully!',
  BULK_CATEGORY_ACTION_FAILED = 'BULK CATEGORY ACTION request failed!',
}

// get category list
export const getCategoryRequest = createAction(
  CategoryActionTypes.GET_CATEGORY_REQUEST,
);
export const getCategorySuccess = createAction<any>(
  CategoryActionTypes.GET_CATEGORY_SUCCESS,
);
export const getCategoryFailed = createAction(
  CategoryActionTypes.GET_CATEGORY_FAILED,
);

/**
 * Add category
 */
export const addCategoryRequest = createAction(
  CategoryActionTypes.ADD_CATEGORY_REQUEST,
);
export const addCategorySuccess = createAction(
  CategoryActionTypes.ADD_CATEGORY_SUCCESS,
);
export const addCategoryFailed = createAction(
  CategoryActionTypes.ADD_CATEGORY_FAILED,
);

/**
 * Category Informations
 */
export const categoryInfoRequest = createAction(
  CategoryActionTypes.CATEGORY_INFO_REQUEST,
);
export const categoryInfoSuccess = createAction(
  CategoryActionTypes.CATEGORY_INFO_SUCCESS,
);
export const categoryInfoFailed = createAction(
  CategoryActionTypes.CATEGORY_INFO_FAILED,
);

/**
 * Update category
 */

export const updateCategoryRequest = createAction(
  CategoryActionTypes.UPDATE_CATEGORY_REQUEST,
);
export const updateCategorySuccess = createAction(
  CategoryActionTypes.UPDATE_CATEGORY_SUCCESS,
);
export const updateCategoryFailed = createAction(
  CategoryActionTypes.UPDATE_CATEGORY_FAILED,
);

/**
 * Delete User
 */

 export const categoryDeleteRequest = createAction(
  CategoryActionTypes.CATEGORY_DELETE_REQUEST,
);
export const categoryDeleteSuccess = createAction(
  CategoryActionTypes.CATEGORY_DELETE_SUCCESS,
);
export const categoryDeleteFailed = createAction(
  CategoryActionTypes.CATEGORY_DELETE_FAILED,
);

/**
 * Category Status 
 */
export const categoryStatusRequest = createAction(
  CategoryActionTypes.UPDATE_CATEGORY_STATUS_REQUEST,
);
export const categoryStatusSuccess = createAction(
  CategoryActionTypes.UPDATE_CATEGORY_STATUS_SUCCESS,
);
export const categoryStatusFailed = createAction(
  CategoryActionTypes.UPDATE_CATEGORY_STATUS_FAILED,
);

export const bulkCategoryActionRequest = createAction(
  CategoryActionTypes.BULK_CATEGORY_ACTION_REQUEST,
);
export const bulkCategoryActionSuccess = createAction<any>(
  CategoryActionTypes.BULK_CATEGORY_ACTION_SUCCESS,
);
export const bulkCategoryActionFailed = createAction(
  CategoryActionTypes.BULK_CATEGORY_ACTION_FAILED,
);