import { createAction } from 'redux-actions';

export enum PressReleaseCategoryActionTypes {
  GET_PRESS_RELEASE_CATEGORY_REQUEST = 'PressRelease Requested!',
  GET_PRESS_RELEASE_CATEGORY_SUCCESS = 'PressRelease data fetch successfully!',
  GET_PRESS_RELEASE_CATEGORY_FAILED = 'PressRelease request failed!',
  ADD_PRESS_RELEASE_CATEGORY_REQUEST = "Add PressRelease Request!",
  ADD_PRESS_RELEASE_CATEGORY_SUCCESS = "Add PressRelease Succesfully!",
  ADD_PRESS_RELEASE_CATEGORY_FAILED = "Add PressRelease Request Failed!",
  PRESS_RELEASE_CATEGORY_INFO_REQUEST = "PressRelease info Request!",
  PRESS_RELEASE_CATEGORY_INFO_SUCCESS = "PressRelease Info Request!",
  PRESS_RELEASE_CATEGORY_INFO_FAILED = "PressRelease Info Failed!",
  PRESS_RELEASE_CATEGORY_DELETE_REQUEST = "PressRelease delete Request!",
  PRESS_RELEASE_CATEGORY_DELETE_SUCCESS = "PressRelease delete Request!",
  PRESS_RELEASE_CATEGORY_DELETE_FAILED = "PressRelease delete Failed!",
  UPDATE_PRESS_RELEASE_CATEGORY_REQUEST = "Update PressRelease Request!",
  UPDATE_PRESS_RELEASE_CATEGORY_SUCCESS = "Update PressRelease Success!",
  UPDATE_PRESS_RELEASE_CATEGORY_FAILED = "Update PressRelease request Failed!",
  UPDATE_PRESS_RELEASE_CATEGORY_STATUS_REQUEST = 'UPDATE PressRelease success Requested!',
  UPDATE_PRESS_RELEASE_CATEGORY_STATUS_SUCCESS = 'UPDATE PressRelease_STATUS successfully!',
  UPDATE_PRESS_RELEASE_CATEGORY_STATUS_FAILED = 'UPDATE PressRelease_STATUS failed!',
}

// get press release category list
export const getPressReleaseCategoryRequest = createAction(
  PressReleaseCategoryActionTypes.GET_PRESS_RELEASE_CATEGORY_REQUEST,
);
export const getPressReleaseCategorySuccess = createAction<any>(
  PressReleaseCategoryActionTypes.GET_PRESS_RELEASE_CATEGORY_SUCCESS,
);
export const getPressReleaseCategoryFailed = createAction(
  PressReleaseCategoryActionTypes.GET_PRESS_RELEASE_CATEGORY_FAILED,
);

/**
 * Add press release Category
 */
export const addPressReleaseCategoryRequest = createAction(
  PressReleaseCategoryActionTypes.ADD_PRESS_RELEASE_CATEGORY_REQUEST,
);
export const addPressReleaseCategorySuccess = createAction(
  PressReleaseCategoryActionTypes.ADD_PRESS_RELEASE_CATEGORY_SUCCESS,
);
export const addPressReleaseCategoryFailed = createAction(
  PressReleaseCategoryActionTypes.ADD_PRESS_RELEASE_CATEGORY_FAILED,
);

/**
 * Press release Category Informations
 */
export const pressReleaseCategoryInfoRequest = createAction(
  PressReleaseCategoryActionTypes.PRESS_RELEASE_CATEGORY_INFO_REQUEST,
);
export const pressReleaseCategoryInfoSuccess = createAction(
  PressReleaseCategoryActionTypes.PRESS_RELEASE_CATEGORY_INFO_SUCCESS,
);
export const pressReleaseCategoryInfoFailed = createAction(
  PressReleaseCategoryActionTypes.PRESS_RELEASE_CATEGORY_INFO_FAILED,
);

/**
 * Update press release category
 */

export const updatePressReleaseCategoryRequest = createAction(
  PressReleaseCategoryActionTypes.UPDATE_PRESS_RELEASE_CATEGORY_REQUEST,
);
export const updatePressReleaseCategorySuccess = createAction(
  PressReleaseCategoryActionTypes.UPDATE_PRESS_RELEASE_CATEGORY_SUCCESS,
);
export const updatePressReleaseCategoryFailed = createAction(
  PressReleaseCategoryActionTypes.UPDATE_PRESS_RELEASE_CATEGORY_FAILED,
);

/**
 * Delete press release category
 */

 export const pressReleaseCategoryDeleteRequest = createAction(
  PressReleaseCategoryActionTypes.PRESS_RELEASE_CATEGORY_DELETE_REQUEST,
);
export const pressReleaseCategoryDeleteSuccess = createAction(
  PressReleaseCategoryActionTypes.PRESS_RELEASE_CATEGORY_DELETE_SUCCESS,
);
export const pressReleaseCategoryDeleteFailed = createAction(
  PressReleaseCategoryActionTypes.PRESS_RELEASE_CATEGORY_DELETE_FAILED,
);

/**
 * Press release category status 
 */
export const pressReleaseCategoryStatusRequest = createAction(
  PressReleaseCategoryActionTypes.UPDATE_PRESS_RELEASE_CATEGORY_STATUS_REQUEST,
);
export const pressReleaseCategoryStatusSuccess = createAction(
  PressReleaseCategoryActionTypes.UPDATE_PRESS_RELEASE_CATEGORY_STATUS_SUCCESS,
);
export const pressReleaseCategoryStatusFailed = createAction(
  PressReleaseCategoryActionTypes.UPDATE_PRESS_RELEASE_CATEGORY_STATUS_FAILED,
);