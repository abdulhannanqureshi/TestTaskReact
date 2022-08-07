import { createAction } from 'redux-actions';

export enum ReportActionTypes {
  EXPORT_STDUENT_REPORT_REQUEST = 'Request for export student reports',

  GET_USER_REPORT_REQUEST = 'USER REPORT Requested!',
  GET_USER_REPORT_SUCCESS = 'USER REPORT data fetch successfully!',
  GET_USER_REPORT_FAILED = 'USER REPORT request failed!',

  GET_SALE_REPORT_REQUEST = 'SALE REPORT Requested!',
  GET_SALE_REPORT_SUCCESS = 'SALE REPORT data fetch successfully!',
  GET_SALE_REPORT_FAILED = 'SALE REPORT request failed!',
}

export const exportReportRequest = createAction(
  ReportActionTypes.EXPORT_STDUENT_REPORT_REQUEST,
);


// // get user report list
// export const getUserReportRequest = createAction(
//   ReportActionTypes.GET_USER_REPORT_REQUEST,
// );
// export const getUserReportSuccess = createAction<any>(
//   ReportActionTypes.GET_USER_REPORT_SUCCESS,
// );
// export const getUserReportFailed = createAction(
//   ReportActionTypes.GET_USER_REPORT_FAILED,
// );


// get sale report list
export const getSaleReportRequest = createAction(
  ReportActionTypes.GET_SALE_REPORT_REQUEST,
);
export const getSaleReportSuccess = createAction<any>(
  ReportActionTypes.GET_SALE_REPORT_SUCCESS,
);
export const getSaleReportFailed = createAction(
  ReportActionTypes.GET_SALE_REPORT_FAILED,
);