import { createAction } from "redux-actions";

export enum FrontendPagesActionTypes {
  // For Get Frontend Pages template
  GET_FRONT_PAGES_REQUEST = "Get Frontend Pages Requested!",
  GET_FRONT_PAGES_SUCCESS = "Get Frontend Pages Successfully!",
  GET_FRONT_PAGES_FAILED = "Get Frontend Pages Failed!",

  // For View Frontend pages template
  VIEW_FRONT_PAGES_REQUEST = "View Frontend Pages Requested!",
  VIEW_FRONT_PAGES_SUCCESS = "View Frontend Pages Successfully!",
  VIEW_FRONT_PAGES_FAILED = "View Frontend Pages Failed!",

  // For Edit Frontend Pages template
  EDIT_FRONT_PAGES_SUCCESS = "Edit Frontend Pages Successfully!",
  EDIT_FRONT_PAGES_FAILED = "Edit Frontend Pages Failed!",
  // For Edit pages request
  EDIT_ABOUT_PAGES_REQUEST = "Edit About Pages Requested!",
  EDIT_ENTERPRISE_PAGES_REQUEST = "Edit Enterprise Pages Requested!",
}

// For Get Frontend template
export const getFrontendPagesRequest = createAction(
  FrontendPagesActionTypes.GET_FRONT_PAGES_REQUEST
);
export const getFrontendPagesSuccess = createAction<any>(
  FrontendPagesActionTypes.GET_FRONT_PAGES_SUCCESS
);
export const getFrontendPagesFailed = createAction(
  FrontendPagesActionTypes.GET_FRONT_PAGES_FAILED
);

// For View Frontend template
export const viewFrontendPagesRequest = createAction(
  FrontendPagesActionTypes.VIEW_FRONT_PAGES_REQUEST
);
export const viewFrontendPagesSuccess = createAction<any>(
  FrontendPagesActionTypes.VIEW_FRONT_PAGES_SUCCESS
);
export const viewFrontendPagesFailed = createAction(
  FrontendPagesActionTypes.VIEW_FRONT_PAGES_FAILED
);

// For Edit Frontend template
export const editFrontendPagesSuccess = createAction<any>(
  FrontendPagesActionTypes.EDIT_FRONT_PAGES_SUCCESS
);
export const editFrontendPagesFailed = createAction(
  FrontendPagesActionTypes.EDIT_FRONT_PAGES_FAILED
);
// For edit pages request only
export const editAboutPagesRequest = createAction(
  FrontendPagesActionTypes.EDIT_ABOUT_PAGES_REQUEST
);
export const editEnterprisePagesRequest = createAction(
  FrontendPagesActionTypes.EDIT_ENTERPRISE_PAGES_REQUEST
);
