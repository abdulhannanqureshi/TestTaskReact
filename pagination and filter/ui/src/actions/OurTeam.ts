import { createAction } from "redux-actions";

export enum OurTeamActionTypes {
  // For Get team
  GET_OUR_TEAM_REQUEST = "Get Our Team Requested!",
  GET_OUR_TEAM_SUCCESS = "Get Our Team successfully!",
  GET_OUR_TEAM_FAILED = "Get Our Team failed!",
  // For Add Team
  ADD_OUR_TEAM_REQUEST = "Add Our Team Requested!",
  ADD_OUR_TEAM_SUCCESS = "Add Our Team successfully!",
  ADD_OUR_TEAM_FAILED = "Add Our Team failed!",
  // For Edit Team
  EDIT_OUR_TEAM_REQUEST = "Edit Our Team Requested!",
  EDIT_OUR_TEAM_FAILED = "Edit Our Team failed!",
  // For View Team
  VIEW_OUR_TEAM_REQUEST = "View Our Team Requested!",
  VIEW_OUR_TEAM_SUCCESS = "View Our Team successfully!",
  VIEW_OUR_TEAM_FAILED = "View Our Team failed!",
  // For Delete Team
  DELETE_OUR_TEAM_REQUEST = "Delete Our Team Requested!",
  DELETE_OUR_TEAM_SUCCESS = "Delete Our Team successfully!",
  DELETE_OUR_TEAM_FAILED = "Delete Our Team failed!",
  // For Status Team
  STATUS_OUR_TEAM_REQUEST = "Status Our Team Requested!",
  STATUS_OUR_TEAM_SUCCESS = "Status Our Team successfully!",
  STATUS_OUR_TEAM_FAILED = "Status Our Team failed!",
  // For Check Team
  BULK_OUR_TEAM_REQUEST = "Bulk Check Our Team Requested!",
  BULK_OUR_TEAM_SUCCESS = "Bulk Check Our Team successfully!",
  BULK_OUR_TEAM_FAILED = "Bulk Check Our Team failed!",
   // For order team request
   ORDER_OUR_TEAM_REQUEST = "Order Check Our Team Requested!",
   ORDER_OUR_TEAM_SUCCESS = "Order Check Our Team successfully!",
   ORDER_OUR_TEAM_FAILED = "Order Check Our Team failed!",
}

// For Get Team
export const getOurTeamRequest = createAction(
  OurTeamActionTypes.GET_OUR_TEAM_REQUEST
);
export const getOurTeamSuccess = createAction<any>(
  OurTeamActionTypes.GET_OUR_TEAM_SUCCESS
);
export const getOurTeamFailed = createAction(
  OurTeamActionTypes.GET_OUR_TEAM_FAILED
);
// For Add Team
export const addOurTeamRequest = createAction(
  OurTeamActionTypes.ADD_OUR_TEAM_REQUEST
);
export const addOurTeamSuccess = createAction<any>(
  OurTeamActionTypes.ADD_OUR_TEAM_SUCCESS
);
export const addOurTeamFailed = createAction(
  OurTeamActionTypes.ADD_OUR_TEAM_FAILED
);
// For Edit Team
export const editOurTeamRequest = createAction(
  OurTeamActionTypes.EDIT_OUR_TEAM_REQUEST
);
export const editOurTeamFailed = createAction(
  OurTeamActionTypes.EDIT_OUR_TEAM_FAILED
);
// For View Team
export const viewOurTeamRequest = createAction(
  OurTeamActionTypes.VIEW_OUR_TEAM_REQUEST
);
export const viewOurTeamSuccess = createAction<any>(
  OurTeamActionTypes.VIEW_OUR_TEAM_SUCCESS
);
export const viewOurTeamFailed = createAction(
  OurTeamActionTypes.VIEW_OUR_TEAM_FAILED
);
// For Delete Team
export const deleteOurTeamRequest = createAction(
  OurTeamActionTypes.DELETE_OUR_TEAM_REQUEST
);
export const deleteOurTeamSuccess = createAction<any>(
  OurTeamActionTypes.DELETE_OUR_TEAM_SUCCESS
);
export const deleteOurTeamFailed = createAction(
  OurTeamActionTypes.DELETE_OUR_TEAM_FAILED
);
// For Status Team
export const statusOurTeamRequest = createAction(
  OurTeamActionTypes.STATUS_OUR_TEAM_REQUEST
);
export const statusOurTeamSuccess = createAction<any>(
  OurTeamActionTypes.STATUS_OUR_TEAM_SUCCESS
);
export const statusOurTeamFailed = createAction(
  OurTeamActionTypes.STATUS_OUR_TEAM_FAILED
);
// For Check Team
export const bulkOurTeamRequest = createAction(
  OurTeamActionTypes.BULK_OUR_TEAM_REQUEST
);
export const bulkOurTeamSuccess = createAction<any>(
  OurTeamActionTypes.BULK_OUR_TEAM_SUCCESS
);
export const bulkOurTeamFailed = createAction(
  OurTeamActionTypes.BULK_OUR_TEAM_FAILED
);

// For updating order
export const orderOurTeamRequest = createAction(
  OurTeamActionTypes.ORDER_OUR_TEAM_REQUEST
);
export const orderOurTeamSuccess = createAction<any>(
  OurTeamActionTypes.ORDER_OUR_TEAM_SUCCESS
);
export const orderOurTeamFailed = createAction(
  OurTeamActionTypes.ORDER_OUR_TEAM_FAILED
);