import { createAction } from 'redux-actions';

export enum UserActionTypes {
  GET_USER_REQUEST = 'USER Requested!',
  GET_USER_SUCCESS = 'USER data fetch successfully!',
  GET_USER_FAILED = 'USER request failed!',
  ADD_USER_REQUEST = "Add USER Request!",
  ADD_USER_SUCCESS = "Add USER Succesfully!",
  ADD_USER_FAILED = "Add USER Request Failed!",
  USER_INFO_REQUEST = "USER info Request!",
  USER_INFO_SUCCESS = "USER Info Request!",
  USER_INFO_FAILED = "USER Info Failed!",
  USER_DELET_REQUEST = "USER delet Request!",
  USER_DELET_SUCCESS = "USER delet Success!",
  USER_DELET_FAILED = "USER delet Failed!",
  UPDATE_USER_REQUEST = "Update USER Request!",
  UPDATE_USER_SUCCESS = "Update USER Success!",
  UPDATE_USER_FAILED = "Update USER request Failed!",
  UPDATE_USER_STATUS_REQUEST = 'UPDATE USER success Requested!',
  UPDATE_USER_STATUS_SUCCESS = 'UPDATE USER_STATUS successfully!',
  UPDATE_USER_STATUS_FAILED = 'UPDATE User_STATUS failed!',
  GET_UNIVERSITY_REQUEST = 'UNIVERSITY Requested!',
  GET_UNIVERSITY_SUCCESS = 'UNIVERSITY data fetch successfully!',
  GET_UNIVERSITY_FAILED = 'UNIVERSITY request failed!',
  GET_CORPORATION_REQUEST = 'CORPORATION Requested!',
  GET_CORPORATION_SUCCESS = 'CORPORATION data fetch successfully!',
  GET_CORPORATION_FAILED = 'CORPORATION request failed!',
  BULK_USER_ACTION_REQUEST = 'BULK USER ACTION Requested!',
  BULK_USER_ACTION_SUCCESS = 'BULK USER ACTION data fetch successfully!',
  BULK_USER_ACTION_FAILED = 'BULK USER ACTION request failed!',
  GET_USER_REPORT_REQUEST = 'GET USER REPORT Requested!',
  GET_USER_REPORT_SUCCESS = 'GET USER REPORT data fetch successfully!',
  GET_USER_REPORT_FAILED = 'GET USER REPORT request failed!',
}

// get user list
export const getUserRequest = createAction(
  UserActionTypes.GET_USER_REQUEST,
);
export const getUserSuccess = createAction<any>(
  UserActionTypes.GET_USER_SUCCESS,
);
export const getUserFailed = createAction(
  UserActionTypes.GET_USER_FAILED,
);

/**
 * Add User
 */
export const addUserRequest = createAction(
  UserActionTypes.ADD_USER_REQUEST,
);
export const addUserSuccess = createAction(
  UserActionTypes.ADD_USER_SUCCESS,
);
export const addUserFailed = createAction(
  UserActionTypes.ADD_USER_FAILED,
);

/**
 * User Informations
 */
export const userInfoRequest = createAction(
  UserActionTypes.USER_INFO_REQUEST,
);
export const userInfoSuccess = createAction(
  UserActionTypes.USER_INFO_SUCCESS,
);
export const userInfoFailed = createAction(
  UserActionTypes.USER_INFO_FAILED,
);

/**
 * Update User
 */

export const updateUserRequest = createAction(
  UserActionTypes.UPDATE_USER_REQUEST,
);
export const updateUserSuccess = createAction(
  UserActionTypes.UPDATE_USER_SUCCESS,
);
export const updateUserFailed = createAction(
  UserActionTypes.UPDATE_USER_FAILED,
);

/**
 * Delete User
 */

 export const userDeleteRequest = createAction(
  UserActionTypes.USER_DELET_REQUEST,
);
export const userDeleteSuccess = createAction(
  UserActionTypes.USER_DELET_SUCCESS,
);
export const userDeleteFailed = createAction(
  UserActionTypes.USER_DELET_FAILED,
);

/**
 * User Status 
 */
export const userStatusRequest = createAction(
  UserActionTypes.UPDATE_USER_STATUS_REQUEST,
);
export const userStatusSuccess = createAction(
  UserActionTypes.UPDATE_USER_STATUS_SUCCESS,
);
export const userStatusFailed = createAction(
  UserActionTypes.UPDATE_USER_STATUS_FAILED,
);



// get university list
export const getUniversityRequest = createAction(
  UserActionTypes.GET_UNIVERSITY_REQUEST,
);
export const getUniversitySuccess = createAction<any>(
  UserActionTypes.GET_UNIVERSITY_SUCCESS,
);
export const getUniversityFailed = createAction(
  UserActionTypes.GET_UNIVERSITY_FAILED,
);


// get corporation list
export const getCorporationRequest = createAction(
  UserActionTypes.GET_CORPORATION_REQUEST,
);
export const getCorporationSuccess = createAction<any>(
  UserActionTypes.GET_CORPORATION_SUCCESS,
);
export const getCorporationFailed = createAction(
  UserActionTypes.GET_CORPORATION_FAILED,
);

// get corporation list
export const bulkUserActionRequest = createAction(
  UserActionTypes.BULK_USER_ACTION_REQUEST,
);
export const bulkUserActionSuccess = createAction<any>(
  UserActionTypes.BULK_USER_ACTION_SUCCESS,
);
export const bulkUserActionFailed = createAction(
  UserActionTypes.BULK_USER_ACTION_FAILED,
);
// get Talent Lms list
export const getUserReportRequest = createAction(
  UserActionTypes. GET_USER_REPORT_REQUEST ,
);
export const getUserReportSuccess = createAction<any>(
  UserActionTypes.GET_USER_REPORT_SUCCESS,
);
export const getUserReportFailed = createAction(
  UserActionTypes.GET_USER_REPORT_FAILED,
); 
