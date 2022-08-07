import { createLogic } from "redux-logic";
import { toast } from "react-toastify";
import { ApiHelper } from "../helper/ApiHelper";
import { ApiRoutes } from "../config";
import {
  // redirectTo,
  showLoader,
  hideLoader,
  FrontendTemplateActionTypes,
  getFrontendTemplateSuccess,
  getFrontendTemplateFailed,
  viewFrontendTemplateSuccess,
  viewFrontendTemplateFailed,
  editFrontendTemplateFailed,
} from "../actions";
// import { IRootState } from "../interfaces";

let toastId: any = null;

// For Get Frontend Template
const getFrontendTemplate = createLogic({
  type: FrontendTemplateActionTypes.GET_FRONT_TEMPLATE_REQUEST,
  async process(data, dispatch: any, done) {
    const { action }: any = data;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.GET_FRONTEND_TEMPLATE.service,
      ApiRoutes.GET_FRONTEND_TEMPLATE.url,
      ApiRoutes.GET_FRONTEND_TEMPLATE.method,
      ApiRoutes.GET_FRONTEND_TEMPLATE.authenticate
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        getFrontendTemplateSuccess({
          templateData: response.data.data,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(getFrontendTemplateFailed());
      done();
    }
  },
});

// For View Frontend Template
const viewFrontendTemplate = createLogic({
  type: FrontendTemplateActionTypes.VIEW_FRONT_TEMPLATE_REQUEST,
  async process(data, dispatch: any, done) {
    const { action }: any = data;
    dispatch(showLoader());

    let params = action.payload;
    for (const property in params) {
      if (!params[property]) delete params[property];
    }
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.VIEW_FRONTEND_TEMPLATE.service,
      ApiRoutes.VIEW_FRONTEND_TEMPLATE.url.replace(":id", action.payload),
      ApiRoutes.VIEW_FRONTEND_TEMPLATE.method,
      ApiRoutes.VIEW_FRONTEND_TEMPLATE.authenticate,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        viewFrontendTemplateSuccess({
          frontendTemplateView: response.data.data,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(viewFrontendTemplateFailed());
      done();
    }
  },
});

// For Edit Frontend Template
const editFrontendTemplate = createLogic({
  type: FrontendTemplateActionTypes.EDIT_FRONT_TEMPLATE_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const { id, editorState, ...restParams } = action.payload;
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.EDIT_FRONTEND_TEMPLATE.service,
      ApiRoutes.EDIT_FRONTEND_TEMPLATE.url.replace(":id", id),
      ApiRoutes.EDIT_FRONTEND_TEMPLATE.method,
      ApiRoutes.EDIT_FRONTEND_TEMPLATE.authenticate,
      undefined,
      restParams
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
      dispatch(editFrontendTemplateFailed());
      done();
    }
  },
});

export const FrontendTemplateLogics = [
  getFrontendTemplate,
  viewFrontendTemplate,
  editFrontendTemplate,
];
