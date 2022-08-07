import { createAction } from 'redux-actions';

export enum DashboardActionTypes {
  GET_DASHBOARD_REQUEST = 'Dashboard requested!',
  GET_DASHBOARD_SUCCESS = 'Dashboard data fetch successfully!',
  GET_DASHBOARD_FAILED = 'Dashboard request failed!',
}

// get dashboard info
export const getDashboardRequest = createAction(
  DashboardActionTypes.GET_DASHBOARD_REQUEST,
);
export const getDashboardSuccess = createAction<any>(
  DashboardActionTypes.GET_DASHBOARD_SUCCESS,
);
export const getDashboardFailed = createAction(
  DashboardActionTypes.GET_DASHBOARD_FAILED,
);

