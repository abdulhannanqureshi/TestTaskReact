import { createLogic } from "redux-logic";
import { toast } from "react-toastify";
import { ApiHelper } from "../helper/ApiHelper";
import { ApiRoutes } from "../config";
import {
  // redirectTo,
  showLoader,
  hideLoader,
  FrontendPagesActionTypes,
  getFrontendPagesSuccess,
  getFrontendPagesFailed,
  viewFrontendPagesSuccess,
  viewFrontendPagesFailed,
  editFrontendPagesFailed,
} from "../actions";
// import { IRootState } from "../interfaces";

let toastId: any = null;

// For Get Frontend Template
const getFrontendPages = createLogic({
  type: FrontendPagesActionTypes.GET_FRONT_PAGES_REQUEST,
  async process(data, dispatch: any, done) {
    const { action }: any = data;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.GET_FRONTEND_PAGES.service,
      ApiRoutes.GET_FRONTEND_PAGES.url,
      ApiRoutes.GET_FRONTEND_PAGES.method,
      ApiRoutes.GET_FRONTEND_PAGES.authenticate
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        getFrontendPagesSuccess({
          templateData: response.data.data,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(getFrontendPagesFailed());
      done();
    }
  },
});

// For View Frontend Template
const viewFrontendPages = createLogic({
  type: FrontendPagesActionTypes.VIEW_FRONT_PAGES_REQUEST,
  async process(data, dispatch: any, done) {
    const { action }: any = data;
    dispatch(showLoader());

    let params = action.payload;
    for (const property in params) {
      if (!params[property]) delete params[property];
    }
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.VIEW_FRONTEND_PAGES.service,
      ApiRoutes.VIEW_FRONTEND_PAGES.url.replace(":id", action.payload),
      ApiRoutes.VIEW_FRONTEND_PAGES.method,
      ApiRoutes.VIEW_FRONTEND_PAGES.authenticate,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        viewFrontendPagesSuccess({
          frontendTemplateView: response.data.data,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(viewFrontendPagesFailed());
      done();
    }
  },
});

// For Edit Frontend Template
const editAboutPages = createLogic({
  type: FrontendPagesActionTypes.EDIT_ABOUT_PAGES_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const { id, editorState1, editorState2, props, ...restParams } =
      action.payload;
    let formData = new FormData();
    for (const property in restParams) {
      formData.append(property, restParams[property]);
    }
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.EDIT_FRONTEND_PAGES.service,
      ApiRoutes.EDIT_FRONTEND_PAGES.url.replace(":id", id),
      ApiRoutes.EDIT_FRONTEND_PAGES.method,
      ApiRoutes.EDIT_FRONTEND_PAGES.authenticate,
      undefined,
      formData
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      action.payload.props.history.goBack();
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(editFrontendPagesFailed());
      done();
    }
  },
});

// For Edit Frontend Template
const editEnterprisePages = createLogic({
  type: FrontendPagesActionTypes.EDIT_ENTERPRISE_PAGES_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const {
      id,
      editorState1,
      editorState2,
      editorState3,
      editorState4,
      editorState5,
      editorState6,
      props,
      ...restParams
    } = action.payload;

    let formData = new FormData();
    for (const property in restParams) {
      formData.append(property, restParams[property]);
    }
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.EDIT_FRONTEND_PAGES.service,
      ApiRoutes.EDIT_FRONTEND_PAGES.url.replace(":id", id),
      ApiRoutes.EDIT_FRONTEND_PAGES.method,
      ApiRoutes.EDIT_FRONTEND_PAGES.authenticate,
      undefined,
      formData
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      action.payload.props.history.goBack();
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(editFrontendPagesFailed());
      done();
    }
  },
});

export const FrontendPagesLogics = [
  getFrontendPages,
  viewFrontendPages,
  editAboutPages,
  editEnterprisePages,
];
