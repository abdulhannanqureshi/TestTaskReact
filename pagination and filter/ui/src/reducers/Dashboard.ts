import { handleActions } from 'redux-actions';
import { DashboardActionTypes } from './../actions';
import { IDashboardModel } from '../interfaces';
import { DashboardInitialState } from '../states';

export const dashboardReducer = handleActions<IDashboardModel, any>(
  {
    [DashboardActionTypes.GET_DASHBOARD_REQUEST]: (state = DashboardInitialState, action) => ({
      ...state,
      isLoading: true,
    }),
    [DashboardActionTypes.GET_DASHBOARD_SUCCESS]: (state = DashboardInitialState, action) => ({
      ...state,
      dashboardData: action.payload.dashboardData,
      isLoading: false,
    }),
    [DashboardActionTypes.GET_DASHBOARD_FAILED]: (state = DashboardInitialState, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),

    
  },
  DashboardInitialState,
);
