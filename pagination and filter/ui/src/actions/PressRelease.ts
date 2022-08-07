import { createAction } from 'redux-actions';

export enum PressReleaseActionTypes {
  GET_PRESS_RELEASE_REQUEST = 'PRESS RELEASE Requested!',
  GET_PRESS_RELEASE_SUCCESS = 'PRESS RELEASE data fetch successfully!',
  GET_PRESS_RELEASE_FAILED = 'PRESS RELEASE request failed!',
  ADD_PRESS_RELEASE_REQUEST = "Add PRESS RELEASE Request!",
  ADD_PRESS_RELEASE_SUCCESS = "Add PRESS RELEASE Succesfully!",
  ADD_PRESS_RELEASE_FAILED = "Add PRESS RELEASE Request Failed!",
  PRESS_RELEASE_INFO_REQUEST = "PRESS RELEASE info Request!",
  PRESS_RELEASE_INFO_SUCCESS = "PRESS RELEASE Info Request!",
  PRESS_RELEASE_INFO_FAILED = "PRESS RELEASE Info Failed!",
  PRESS_RELEASE_DELETE_REQUEST = "PRESS RELEASE delete Request!",
  PRESS_RELEASE_DELETE_SUCCESS = "PRESS RELEASE delete Request!",
  PRESS_RELEASE_DELETE_FAILED = "PRESS RELEASE delete Failed!",
  UPDATE_PRESS_RELEASE_REQUEST = "Update PRESS RELEASE Request!",
  UPDATE_PRESS_RELEASE_SUCCESS = "Update PRESS RELEASE Success!",
  UPDATE_PRESS_RELEASE_FAILED = "Update PRESS RELEASE request Failed!",
  UPDATE_PRESS_RELEASE_STATUS_REQUEST = 'UPDATE PRESS RELEASE success Requested!',
  UPDATE_PRESS_RELEASE_STATUS_SUCCESS = 'UPDATE PRESS_RELEASE_STATUS successfully!',
  UPDATE_PRESS_RELEASE_STATUS_FAILED = 'UPDATE PRESS_RELEASE_STATUS failed!',
  BULK_PRESS_RELEASE_ACTION_REQUEST = 'BULK PRESS RELEASE ACTION Requested!',
  BULK_PRESS_RELEASE_SUCCESS = 'BULK PRESS RELEASE ACTION data fetch successfully!',
  BULK_PRESS_RELEASE_FAILED = 'BULK PRESS RELEASE ACTION request failed!',
}

// get press release list
export const getPressReleaseRequest = createAction(
  PressReleaseActionTypes.GET_PRESS_RELEASE_REQUEST,
);
export const getPressReleaseSuccess = createAction<any>(
  PressReleaseActionTypes.GET_PRESS_RELEASE_SUCCESS,
);
export const getPressReleaseFailed = createAction(
  PressReleaseActionTypes.GET_PRESS_RELEASE_FAILED,
);

/**
 * Add press release
 */
export const addPressReleaseRequest = createAction(
  PressReleaseActionTypes.ADD_PRESS_RELEASE_REQUEST,
);
export const addPressReleaseSuccess = createAction(
  PressReleaseActionTypes.ADD_PRESS_RELEASE_SUCCESS,
);
export const addPressReleaseFailed = createAction(
  PressReleaseActionTypes.ADD_PRESS_RELEASE_FAILED,
);

/**
 * Press release informations
 */
export const pressReleaseInfoRequest = createAction(
  PressReleaseActionTypes.PRESS_RELEASE_INFO_REQUEST,
);
export const pressReleaseInfoSuccess = createAction(
  PressReleaseActionTypes.PRESS_RELEASE_INFO_SUCCESS,
);
export const pressReleaseInfoFailed = createAction(
  PressReleaseActionTypes.PRESS_RELEASE_INFO_FAILED,
);

/**
 * Update press release
 */

export const updatePressReleaseRequest = createAction(
  PressReleaseActionTypes.UPDATE_PRESS_RELEASE_REQUEST,
);
export const updatePressReleaseSuccess = createAction(
  PressReleaseActionTypes.UPDATE_PRESS_RELEASE_SUCCESS,
);
export const updatePressReleaseFailed = createAction(
  PressReleaseActionTypes.UPDATE_PRESS_RELEASE_FAILED,
);

/**
 * Delete press release
 */

 export const pressReleaseDeleteRequest = createAction(
  PressReleaseActionTypes.PRESS_RELEASE_DELETE_REQUEST,
);
export const pressReleaseDeleteSuccess = createAction(
  PressReleaseActionTypes.PRESS_RELEASE_DELETE_SUCCESS,
);
export const pressReleaseDeleteFailed = createAction(
  PressReleaseActionTypes.PRESS_RELEASE_DELETE_FAILED,
);

/**
 * Press release status 
 */
export const pressReleaseStatusRequest = createAction(
  PressReleaseActionTypes.UPDATE_PRESS_RELEASE_STATUS_REQUEST,
);
export const pressReleaseStatusSuccess = createAction(
  PressReleaseActionTypes.UPDATE_PRESS_RELEASE_STATUS_SUCCESS,
);
export const pressReleaseStatusFailed = createAction(
  PressReleaseActionTypes.UPDATE_PRESS_RELEASE_STATUS_FAILED,
);
// get corporation list
export const bulkPressReleaseActionRequest = createAction(
  PressReleaseActionTypes.BULK_PRESS_RELEASE_ACTION_REQUEST,
);
export const bulkPressReleaseActionSuccess = createAction<any>( 
  PressReleaseActionTypes.BULK_PRESS_RELEASE_SUCCESS,
);
export const bulkPressReleaseActionFailed = createAction(
  PressReleaseActionTypes.BULK_PRESS_RELEASE_FAILED,
);  