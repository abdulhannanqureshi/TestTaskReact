import { createAction } from "redux-actions";

export enum LabActionTypes {
  // For Add Labs
  ADD_LAB_REQUEST = "Lab Requested!",
  ADD_LAB_SUCCESS = "Lab Add Data successfully!",
  ADD_LAB_FAILED = "Lab request failed!",

  // For Get Labs
  GET_LAB_REQUEST = "Get lab Requested!",
  GET_LAB_SUCCESS = "Get lab  Data successfully!",
  GET_LAB_FAILED = "Get lab request failed!",

  //For status change
  STATUS_LAB_REQUEST = "status lab Requested!",
  STATUS_LAB_SUCCESS = "status lab  Data successfully!",
  STATUS_LAB_FAILED = "status lab request failed!",

  //For delete lab
  DELETE_LAB_REQUEST = "delete lab Requested!",
  DELETE_LAB_SUCCESS = "delete lab  Data successfully!",
  DELETE_LAB_FAILED = "delete lab request failed!",
  //For view lab
  VIEW_LAB_REQUEST = "view lab Requested!",
  VIEW_LAB_SUCCESS = "view lab  Data successfully!",
  VIEW_LAB_FAILED = "view lab request failed!",
  //For edit lab
  EDIT_LAB_REQUEST = "edit lab Requested!",
  EDIT_LAB_SUCCESS = "edit lab  Data successfully!",
  EDIT_LAB_FAILED = "edit lab request failed!",
  //For bulk lab
  BULK_LAB_REQUEST = "bulk lab Requested!",
  BULK_LAB_SUCCESS = "bulk lab  Data successfully!",
  BULK_LAB_FAILED = "bulk lab request failed!",


}

// For ADD Lab
export const addLabRequest = createAction(
  LabActionTypes.ADD_LAB_REQUEST
);
export const addLabSuccess = createAction<any>(
  LabActionTypes.ADD_LAB_SUCCESS
);
export const addLabFailed = createAction(
  LabActionTypes.ADD_LAB_FAILED
);
// For GET Lab
export const getLabRequest = createAction(
  LabActionTypes.GET_LAB_REQUEST
);
export const getLabSuccess = createAction<any>(
  LabActionTypes.GET_LAB_SUCCESS
);
export const getLabFailed = createAction(
  LabActionTypes.GET_LAB_FAILED
);
//For status change
export const statusLabRequest = createAction(
  LabActionTypes.STATUS_LAB_REQUEST
);
export const statusLabSuccess = createAction<any>(
  LabActionTypes.STATUS_LAB_SUCCESS
);
export const statusLabFailed = createAction(
  LabActionTypes.STATUS_LAB_FAILED
);

//For Deleting lab
export const deleteLabRequest = createAction(
  LabActionTypes.DELETE_LAB_REQUEST
);
export const deleteLabSuccess = createAction<any>(
  LabActionTypes.DELETE_LAB_SUCCESS
);
export const deleteLabFailed = createAction(
  LabActionTypes.DELETE_LAB_FAILED
);

//For View lab
export const viewLabRequest = createAction(
  LabActionTypes.VIEW_LAB_REQUEST
);
export const  viewLabSuccess = createAction<any>(
  LabActionTypes.VIEW_LAB_SUCCESS
);
export const  viewLabFailed = createAction(
  LabActionTypes.VIEW_LAB_FAILED
);
//For Edit lab
export const editLabRequest = createAction(
  LabActionTypes.EDIT_LAB_REQUEST
);
export const  editLabSuccess = createAction<any>(
  LabActionTypes.EDIT_LAB_SUCCESS
);
export const  editLabFailed = createAction(
  LabActionTypes.EDIT_LAB_FAILED
);
//For BULK lab
export const BulkLabRequest = createAction(
  LabActionTypes.BULK_LAB_REQUEST
);
export const  BulkLabSuccess = createAction<any>(
  LabActionTypes.BULK_LAB_SUCCESS
);
export const  BulkLabFailed = createAction(
  LabActionTypes.BULK_LAB_FAILED
);
