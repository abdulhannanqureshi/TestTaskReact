import { createLogic } from "redux-logic";
import { toast } from "react-toastify";
import { ApiHelper } from "../helper/ApiHelper";
import { ApiRoutes } from "../config";
import { DashboardActionTypes, showLoader, hideLoader, getDashboardSuccess, getDashboardFailed } from "../actions";

let toastId: any = null;

const getDashboard = createLogic({
  type: DashboardActionTypes.GET_DASHBOARD_REQUEST,
  async process(data, dispatch: any, done) {

    const {action} : any = data;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.GET_DASHBOARD.service,
      ApiRoutes.GET_DASHBOARD.url,
      ApiRoutes.GET_DASHBOARD.method,
      ApiRoutes.GET_DASHBOARD.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        getDashboardSuccess({
            dashboardData: response.data.data,
        })
      );
      done();
    } else {
      console.log(response);
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(getDashboardFailed());
      done();
    }
  }
});

export const dashboardLogics = [getDashboard];
