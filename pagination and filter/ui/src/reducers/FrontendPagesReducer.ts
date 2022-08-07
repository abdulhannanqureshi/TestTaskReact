import { handleActions } from "redux-actions";
import { FrontendPagesActionTypes } from "./../actions";
import { IFrontendTemplateModel } from "../interfaces";
import { FrontendPagesInitialState } from "../states";

export const FrontendPagesReducer = handleActions<IFrontendTemplateModel, any>(
  {
    // For Get Frontend Template
    [FrontendPagesActionTypes.GET_FRONT_PAGES_REQUEST]: (state, action) => ({
      ...state,
    }),
    [FrontendPagesActionTypes.GET_FRONT_PAGES_SUCCESS]: (state, action) => ({
      ...state,
      templateData: action.payload.templateData,
    }),
    [FrontendPagesActionTypes.GET_FRONT_PAGES_FAILED]: (state, action) => ({
      ...state,
      isError: true,
    }),
    // For View  Frontend Template
    [FrontendPagesActionTypes.VIEW_FRONT_PAGES_REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [FrontendPagesActionTypes.VIEW_FRONT_PAGES_SUCCESS]: (state, action) => ({
      ...state,
      frontendTemplateView: action.payload.frontendTemplateView,
      isLoading: false,
    }),
    [FrontendPagesActionTypes.VIEW_FRONT_PAGES_FAILED]: (state, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),
    // For Edit Frontend Template
    [FrontendPagesActionTypes.EDIT_FRONT_PAGES_FAILED]: (state, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),
    // For Edit Request Only
    [FrontendPagesActionTypes.EDIT_ABOUT_PAGES_REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [FrontendPagesActionTypes.EDIT_ENTERPRISE_PAGES_REQUEST]: (
      state,
      action
    ) => ({
      ...state,
      isLoading: true,
    }),
  },
  FrontendPagesInitialState
);
