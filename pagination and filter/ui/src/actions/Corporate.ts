import { createAction } from "redux-actions";

export enum CorporateActionTypes {
  // For Add Corporate
  ADD_CORPORATE_REQUEST = "Corporate Requested!",
  ADD_CORPORATE_SUCCESS = "Corporate Add Data successfully!",
  ADD_CORPORATE_FAILED = "Corporate request failed!",
  // For Get Corporate List
  GET_CORPORATE_REQUEST = "Get Corporate Requested!",
  GET_CORPORATE_SUCCESS = "Get Corporate successfully!",
  GET_CORPORATE_FAILED = "Get Corporate failed!",
  // For Status Corporate
  STATUS_CORPORATE_REQUEST = "Status Corporate Requested!",
  STATUS_CORPORATE_SUCCESS = "Status Corporate successfully!",
  STATUS_CORPORATE_FAILED = "Status Corporate failed!",
  // For Delete Corporate
  DELETE_CORPORATE_REQUEST = "Delete Corporate Requested!",
  // For View Corporate
  VIEW_CORPORATE_REQUEST = "View Corporate Requested!",
  VIEW_CORPORATE_SUCCESS = "View Corporate successfully!",
  VIEW_CORPORATE_FAILED = "View Corporate failed!",
  // For Edit Corporate
  EDIT_CORPORATE_REQUEST = "Edit Corporate Requested!",
  EDIT_CORPORATE_FAILED = "Edit Corporate failed!",
}

// For ADD Corporate
export const addCorporateRequest = createAction(
  CorporateActionTypes.ADD_CORPORATE_REQUEST
);
export const addCorporateSuccess = createAction<any>(
  CorporateActionTypes.ADD_CORPORATE_SUCCESS
);
export const addCorporateFailed = createAction(
  CorporateActionTypes.ADD_CORPORATE_FAILED
);

//For Get Corporate List
export const getCorporateRequest = createAction(
  CorporateActionTypes.GET_CORPORATE_REQUEST
);
export const getCorporateSuccess = createAction<any>(
  CorporateActionTypes.GET_CORPORATE_SUCCESS
);
export const getCorporateFailed = createAction(
  CorporateActionTypes.GET_CORPORATE_FAILED
);

//For Status Corporate
export const statusCorporateRequest = createAction(
  CorporateActionTypes.STATUS_CORPORATE_REQUEST
);
export const statusCorporateSuccess = createAction<any>(
  CorporateActionTypes.STATUS_CORPORATE_SUCCESS
);
export const statusCorporateFailed = createAction(
  CorporateActionTypes.STATUS_CORPORATE_FAILED
);

//For Delete Corporate
export const deleteCorporateRequest = createAction(
  CorporateActionTypes.DELETE_CORPORATE_REQUEST
);

//For View Corporate
export const viewCorporateRequest = createAction(
  CorporateActionTypes.VIEW_CORPORATE_REQUEST
);
export const viewCorporateSuccess = createAction<any>(
  CorporateActionTypes.VIEW_CORPORATE_SUCCESS
);
export const viewCorporateFailed = createAction(
  CorporateActionTypes.VIEW_CORPORATE_FAILED
);

//For Edit Corporate
export const editCorporateRequest = createAction(
  CorporateActionTypes.EDIT_CORPORATE_REQUEST
);
export const editCorporateFailed = createAction(
  CorporateActionTypes.EDIT_CORPORATE_FAILED
);