import { handleActions } from 'redux-actions';
import { ReportActionTypes } from './../actions';
import { IUserReportModel, ISaleReportModel } from '../interfaces';
import { UserReportInitialState, SaleReportInitialState } from '../states';

export const userReportReducer = handleActions<IUserReportModel, any>(
  {
    [ReportActionTypes.GET_USER_REPORT_REQUEST]: (state = UserReportInitialState, action) => ({
      ...state,
      isLoading: true,
    }),
    [ReportActionTypes.GET_USER_REPORT_SUCCESS]: (state = UserReportInitialState, action) => ({
      ...state,
      userReportData: action.payload.userReportData,
      totalRecords: action.payload.totalRecords,
      isLoading: false,
    }),
    [ReportActionTypes.GET_USER_REPORT_FAILED]: (state = UserReportInitialState, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),

    
  },
  UserReportInitialState,
);

export const saleReportReducer = handleActions<ISaleReportModel, any>(
    {
      [ReportActionTypes.GET_SALE_REPORT_REQUEST]: (state = SaleReportInitialState, action) => ({
        ...state,
        isLoading: true,
      }),
      [ReportActionTypes.GET_SALE_REPORT_SUCCESS]: (state = SaleReportInitialState, action) => ({
        ...state,
        saleReportData: action.payload.saleReportData,
        totalRecords: action.payload.totalRecords,
        isLoading: false,
      }),
      [ReportActionTypes.GET_SALE_REPORT_FAILED]: (state = SaleReportInitialState, action) => ({
        ...state,
        isLoading: false,
        isError: true,
      }),
  
      
    },
    SaleReportInitialState,
  );
  