import { createAction } from "redux-actions";

export enum FrontendTemplateActionTypes {
  // For Get Frontend template
  GET_FRONT_TEMPLATE_REQUEST = "Get Frontend Template Requested!",
  GET_FRONT_TEMPLATE_SUCCESS = "Get Frontend Template Successfully!",
  GET_FRONT_TEMPLATE_FAILED = "Get Frontend Template Failed!",

  // For View Frontend template
  VIEW_FRONT_TEMPLATE_REQUEST = "View Frontend Template Requested!",
  VIEW_FRONT_TEMPLATE_SUCCESS = "View Frontend Template Successfully!",
  VIEW_FRONT_TEMPLATE_FAILED = "View Frontend Template Failed!",

  // For Edit Frontend template
  EDIT_FRONT_TEMPLATE_REQUEST = "Edit Frontend Template Requested!",
  EDIT_FRONT_TEMPLATE_SUCCESS = "Edit Frontend Template Successfully!",
  EDIT_FRONT_TEMPLATE_FAILED = "Edit Frontend Template Failed!",
}

// For Get Frontend template
export const getFrontendTemplateRequest = createAction(
  FrontendTemplateActionTypes.GET_FRONT_TEMPLATE_REQUEST
);
export const getFrontendTemplateSuccess = createAction<any>(
  FrontendTemplateActionTypes.GET_FRONT_TEMPLATE_SUCCESS
);
export const getFrontendTemplateFailed = createAction(
  FrontendTemplateActionTypes.GET_FRONT_TEMPLATE_FAILED
);

// For View Frontend template
export const viewFrontendTemplateRequest = createAction(
  FrontendTemplateActionTypes.VIEW_FRONT_TEMPLATE_REQUEST
);
export const viewFrontendTemplateSuccess = createAction<any>(
  FrontendTemplateActionTypes.VIEW_FRONT_TEMPLATE_SUCCESS
);
export const viewFrontendTemplateFailed = createAction(
  FrontendTemplateActionTypes.VIEW_FRONT_TEMPLATE_FAILED
);

// For Edit Frontend template
export const editFrontendTemplateRequest = createAction(
  FrontendTemplateActionTypes.EDIT_FRONT_TEMPLATE_REQUEST
);
export const editFrontendTemplateSuccess = createAction<any>(
  FrontendTemplateActionTypes.EDIT_FRONT_TEMPLATE_SUCCESS
);
export const editFrontendTemplateFailed = createAction(
  FrontendTemplateActionTypes.EDIT_FRONT_TEMPLATE_FAILED
);