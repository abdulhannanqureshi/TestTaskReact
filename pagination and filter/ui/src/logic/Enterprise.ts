import { createLogic } from "redux-logic";
import { toast } from "react-toastify";
import { ApiHelper } from "../helper/ApiHelper";
import { ApiRoutes } from "../config";
import { EnterpriseActionTypes, showLoader, hideLoader, getEnterpriseSuccess, getEnterpriseFailed } from "../actions";

let toastId: any = null;

const getEnterprises = createLogic({
  type: EnterpriseActionTypes.GET_ENTERPRISE_REQUEST,
  async process(data, dispatch: any, done) {    
    const {action} : any = data;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.GET_ENTERPRISE.service,
      ApiRoutes.GET_ENTERPRISE.url,
      ApiRoutes.GET_ENTERPRISE.method,
      ApiRoutes.GET_ENTERPRISE.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        getEnterpriseSuccess({
          currentPage: action.payload.skip,
          enterpriseData: response.data.data,
          totalRecords: response.data.totalRecords
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(getEnterpriseFailed());
      done();
    }
  }
});

export const EnterpriseLogics = [getEnterprises];
