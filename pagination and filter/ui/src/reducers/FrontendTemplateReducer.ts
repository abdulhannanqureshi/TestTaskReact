import { handleActions } from "redux-actions";
import { FrontendTemplateActionTypes } from "./../actions";
import { IFrontendTemplateModel } from "../interfaces";
import { FrontendTemplateInitialState } from "../states";

export const FrontendTemplateReducer = handleActions<IFrontendTemplateModel, any>(
  {
    // For Get Frontend Template
    [FrontendTemplateActionTypes.GET_FRONT_TEMPLATE_REQUEST]: (
      state,
      action
    ) => ({
      ...state,
    }),
    [FrontendTemplateActionTypes.GET_FRONT_TEMPLATE_SUCCESS]: (
      state,
      action
    ) => ({
      ...state,
      templateData: action.payload.templateData,
    }),
    [FrontendTemplateActionTypes.GET_FRONT_TEMPLATE_FAILED]: (
      state,
      action
    ) => ({
      ...state,
      isError: true,
    }),
    // For View  Frontend Template
    [FrontendTemplateActionTypes.VIEW_FRONT_TEMPLATE_REQUEST]: (
      state,
      action
    ) => ({
      ...state,
      isLoading: true,
    }),
    [FrontendTemplateActionTypes.VIEW_FRONT_TEMPLATE_SUCCESS]: (
      state,
      action
    ) => ({
      ...state,
      frontendTemplateView: action.payload.frontendTemplateView,
      isLoading: false,
    }),
    [FrontendTemplateActionTypes.VIEW_FRONT_TEMPLATE_FAILED]: (
      state,
      action
    ) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),
    // For Edit Frontend Template
    [FrontendTemplateActionTypes.EDIT_FRONT_TEMPLATE_REQUEST]: (
      state,
      action
    ) => ({
      ...state,
      isLoading: true,
    }),
    [FrontendTemplateActionTypes.EDIT_FRONT_TEMPLATE_FAILED]: (
      state,
      action
    ) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),
  },
  FrontendTemplateInitialState
);
