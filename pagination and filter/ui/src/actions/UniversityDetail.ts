import { createAction } from 'redux-actions';

export enum UniversityActionTypes {
  GET_UNIVERSITY_REQUEST = 'University get data Requested!',
  GET_UNIVERSITY_SUCCESS = 'University get data fetch successfully!',
  GET_UNIVERSITY_FAILED = 'University  get data request failed!',
  ADD_UNIVERSITY_REQUEST = 'University add Requested!',
  ADD_UNIVERSITY_SUCCESS = 'University add data fetch successfully!',
  ADD_UNIVERSITY_FAILED = 'University add request failed!',
  EDIT_UNIVERSITY_REQUEST = 'University edit Requested!',
  EDIT_UNIVERSITY_SUCCESS = 'University edit data fetch successfully!',
  EDIT_UNIVERSITY_FAILED = 'University edit request failed!',
  DELETE_UNIVERSITY_REQUEST = 'University delete Requested!',
  DELETE_UNIVERSITY_SUCCESS = 'University delete data fetch successfully!',
  DELETE_UNIVERSITY_FAILED = 'University delete request failed!',
  UPDATE_UNIVERSITY_STATUS_REQUEST='University update status Requested!',
  UPDATE_UNIVERSITY_STATUS_SUCCESS='University update status  request fetch successfully!',
  UPDATE_UNIVERSITY_STATUS_FAILED='University update status request failed!',
  VIEW_SPECIFIC_UNIVERSITY__REQUEST='University get single info requested!',
  VIEW_SPECIFIC_UNIVERSITY_SUCCESS='University get single info fetch successfully!',
  VIEW_SPECIFIC_UNIVERSITY_FAILED='University get single info request failed!'
}

// get universisy list
export const getUniversityListRequest = createAction(
  UniversityActionTypes. GET_UNIVERSITY_REQUEST,
);
export const getUniversityListSuccess = createAction<any>(
  UniversityActionTypes.GET_UNIVERSITY_SUCCESS,
);
export const getUniversityListFailed = createAction(
  UniversityActionTypes.GET_UNIVERSITY_FAILED
);
// add university list
export const addUniversityRequest = createAction(
  UniversityActionTypes.ADD_UNIVERSITY_REQUEST,
);
export const addUniversitySuccess = createAction<any>(
  UniversityActionTypes.ADD_UNIVERSITY_SUCCESS,
);
export const addUniversityFailed = createAction(
  UniversityActionTypes.ADD_UNIVERSITY_FAILED
);
// update university list
export const updateUniversityRequest = createAction(
  UniversityActionTypes.EDIT_UNIVERSITY_REQUEST,
);
export const updateUniversitySuccess = createAction<any>(
  UniversityActionTypes.EDIT_UNIVERSITY_SUCCESS,
);
export const updateUniversityFailed = createAction(
  UniversityActionTypes.EDIT_UNIVERSITY_FAILED
);

//delete university list 
export const deleteUniversityRequest = createAction(
  UniversityActionTypes.DELETE_UNIVERSITY_REQUEST,
);
export const deleteUniversitySuccess = createAction<any>(
  UniversityActionTypes.DELETE_UNIVERSITY_SUCCESS,
);
export const deleteUniversityFailed = createAction(
  UniversityActionTypes.DELETE_UNIVERSITY_FAILED
);
//update status of  university list 
export const updateUniversityStatusRequest = createAction(
  UniversityActionTypes.UPDATE_UNIVERSITY_STATUS_REQUEST,
);
export const updateUniversityStatusSuccess = createAction<any>(
  UniversityActionTypes.UPDATE_UNIVERSITY_STATUS_SUCCESS,
);
export const updateUniversityStatusFailed = createAction(
  UniversityActionTypes.UPDATE_UNIVERSITY_STATUS_FAILED
);

// get single id university listing
export const getUniversityInfoRequest = createAction(
  UniversityActionTypes.VIEW_SPECIFIC_UNIVERSITY__REQUEST,
);
export const getUniversityInfoSuccess = createAction<any>(
  UniversityActionTypes.VIEW_SPECIFIC_UNIVERSITY_SUCCESS,
);
export const getUniversityInfoFailed = createAction(
  UniversityActionTypes.VIEW_SPECIFIC_UNIVERSITY_FAILED
)