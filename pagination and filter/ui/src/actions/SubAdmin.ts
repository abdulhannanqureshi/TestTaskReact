import { createAction } from "redux-actions";

export enum SubAdminActionTypes {
  // For Get Sub Admin
  GET_SUB_ADMIN_REQUEST = "Get Sub Admin Requested!",
  GET_SUB_ADMIN_SUCCESS = "Get Sub Admin successfully!",
  GET_SUB_ADMIN_FAILED = "Get Sub Admin failed!",
  // For Add Sub Admin
  ADD_SUB_ADMIN_REQUEST = "Add Sub Admin Requested!",
  ADD_SUB_ADMIN_FAILED = "Add Sub Admin failed!",
  // For View Sub Admin
  VIEW_SUB_ADMIN_REQUEST = "View Sub Admin Requested!",
  VIEW_SUB_ADMIN_SUCCESS = "View Sub Admin Successfully!",
  VIEW_SUB_ADMIN_FAILED = "View Sub Admin Failed!",
  // For Edit Sub Admin
  EDIT_SUB_ADMIN_REQUEST = "Edit Sub Admin Requested!",
  EDIT_SUB_ADMIN_FAILED = "Edit Sub Admin Failed!",
  // For Delete Sub Admin
  DELETE_SUB_ADMIN_REQUEST = "Delete Sub Admin Requested!",
  DELETE_SUB_ADMIN_SUCCESS = "Delete Sub Admin Successfully!",
  DELETE_SUB_ADMIN_FAILED = "Delete Sub Admin Failed!",
  // For Status Sub Admin
  STATUS_SUB_ADMIN_REQUEST = "Status Sub Admin Requested!",
  STATUS_SUB_ADMIN_FAILED = "Status Sub Admin Failed!",
  // For List Download Sub Admin
  REPORT_SUB_ADMIN_REQUEST = "Report Sub Admin Requested!",
  REPORT_SUB_ADMIN_SUCCESS = "Report Sub Admin Successfully!",
  REPORT_SUB_ADMIN_FAILED = "Report Sub Admin Failed!",
  // For Bulk Sub Admin
  BULK_ACTION_SUB_ADMIN_REQUEST = "Bulk Action Sub Admin Requested!",
  BULK_ACTION_SUB_ADMIN_SUCCESS = "Bulk Action Sub Admin Successfully!",
  BULK_ACTION_SUB_ADMIN_FAILED = "Bulk Action Sub Admin Failed!",
  // For Sub Admin Check
  CHECK_SUB_ADMIN_REQUEST = "Check Sub Admin Requested!",
  CHECK_SUB_ADMIN_SUCCESS = "Check Sub Admin Successfully!",
  CHECK_SUB_ADMIN_FAILED = "Check Sub Admin Failed!",
}

// For Get Sub Admin
export const getSubAdminRequest = createAction(
  SubAdminActionTypes.GET_SUB_ADMIN_REQUEST
);
export const getSubAdminSuccess = createAction<any>(
  SubAdminActionTypes.GET_SUB_ADMIN_SUCCESS
);
export const getSubAdminFailed = createAction(
  SubAdminActionTypes.GET_SUB_ADMIN_FAILED
);

// For Add Sub Admin
export const addSubAdminRequest = createAction(
  SubAdminActionTypes.ADD_SUB_ADMIN_REQUEST
);
export const addSubAdminFailed = createAction(
  SubAdminActionTypes.ADD_SUB_ADMIN_FAILED
);

// For View Sub Admin
export const viewSubAdminRequest = createAction(
  SubAdminActionTypes.VIEW_SUB_ADMIN_REQUEST
);
export const viewSubAdminSuccess = createAction(
  SubAdminActionTypes.VIEW_SUB_ADMIN_SUCCESS
);
export const viewSubAdminFailed = createAction(
  SubAdminActionTypes.VIEW_SUB_ADMIN_FAILED
);

// For Edit Sub Admin
export const editSubAdminRequest = createAction(
  SubAdminActionTypes.EDIT_SUB_ADMIN_REQUEST
);
export const editSubAdminFailed = createAction(
  SubAdminActionTypes.EDIT_SUB_ADMIN_FAILED
);

// For Delete Sub Admin
export const deleteSubAdminRequest = createAction(
  SubAdminActionTypes.DELETE_SUB_ADMIN_REQUEST
);
export const deleteSubAdminSuccess = createAction(
  SubAdminActionTypes.DELETE_SUB_ADMIN_SUCCESS
);
export const deleteSubAdminFailed = createAction(
  SubAdminActionTypes.DELETE_SUB_ADMIN_FAILED
);

// For Status Sub Admin
export const statusSubAdminRequest = createAction(
  SubAdminActionTypes.STATUS_SUB_ADMIN_REQUEST
);
export const statusSubAdminFailed = createAction(
  SubAdminActionTypes.STATUS_SUB_ADMIN_FAILED
);

// For For List Download Sub Admin
export const reportSubAdminRequest = createAction(
  SubAdminActionTypes.REPORT_SUB_ADMIN_REQUEST
);
export const reportSubAdminSuccess = createAction(
  SubAdminActionTypes.REPORT_SUB_ADMIN_SUCCESS
);
export const reportSubAdminFailed = createAction(
  SubAdminActionTypes.REPORT_SUB_ADMIN_FAILED
);

// For Bulk Sub Admin
export const bulkActionSubAdminRequest = createAction(
  SubAdminActionTypes.BULK_ACTION_SUB_ADMIN_REQUEST
);
export const bulkActionSubAdminSuccess = createAction(
  SubAdminActionTypes.BULK_ACTION_SUB_ADMIN_SUCCESS
);
export const bulkActionSubAdminFailed = createAction(
  SubAdminActionTypes.BULK_ACTION_SUB_ADMIN_FAILED
);

// For Check Sub Admin
export const checkActionSubAdminRequest = createAction(
  SubAdminActionTypes.CHECK_SUB_ADMIN_REQUEST
);
export const checkActionSubAdminSuccess = createAction(
  SubAdminActionTypes.CHECK_SUB_ADMIN_SUCCESS
);
export const checkActionSubAdminFailed = createAction(
  SubAdminActionTypes.CHECK_SUB_ADMIN_FAILED
);