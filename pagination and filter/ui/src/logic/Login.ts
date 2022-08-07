import { createLogic } from "redux-logic";
import { push } from "react-router-redux";
import { toast } from "react-toastify";
import {
  LoginActionTypes,
  LoginSuccess,
  LoginFailed,
  redirectTo,
  showLoader,
  hideLoader,
  checkActionSubAdminSuccess,
  checkActionSubAdminFailed,
} from "../actions";
import { ApiRoutes, AppRoutes } from "../config";
import { ApiHelper } from "../helper";
import navigation from "../_nav";
/**
 *
 */

let toastId: any = null;

const loginLogic = createLogic({
  type: LoginActionTypes.LOGIN_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(push("/dashboard"));
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.ADMIN_LOGIN.service,
      ApiRoutes.ADMIN_LOGIN.url,
      ApiRoutes.ADMIN_LOGIN.method,
      ApiRoutes.ADMIN_LOGIN.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      localStorage.setItem("token", response.data.token);
      dispatch(
        LoginSuccess({
          userData: response.data.data,
        })
      );
      dispatch(checkActionSubAdminSuccess(response.data.data.rolesPermission));

      localStorage.setItem(
        "SubAdminCheck",
        JSON.stringify(response.data.data.rolesPermission.sort())
      );
      let getDashboard: any = response.data.data.rolesPermission.filter(
        (e: any) => e === "Dashboard"
      );

      if (
        response.data.data.rolesPermission &&
        response.data.data.rolesPermission.length
      ) {
        if (getDashboard && getDashboard.length) {
          dispatch(push("/dashboard"));
        } else {
          navigation.items.map((nav: any) => {
            if (
              nav.name === response.data.data.rolesPermission[0] ||
              nav.innerPage === response.data.data.rolesPermission[0]
            ) {
              dispatch(push(nav.url));
            }
          });
        }
      } else {
        dispatch(push("/dashboard"));
      }

      done();
    } else {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(
        LoginFailed({
          error: response.messages[0],
        })
      );
      dispatch(
        checkActionSubAdminFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});

const logOutLogic = createLogic({
  type: LoginActionTypes.LOGOUT_REQUEST,
  async process({ action }, dispatch: any, done) {
    localStorage.removeItem("token");
    dispatch(redirectTo({ path: AppRoutes.LOGIN }));
    dispatch(checkActionSubAdminSuccess([]));
    localStorage.removeItem("SubAdminCheck");
    done();
  },
});

export const LoginLogics = [loginLogic, logOutLogic];
