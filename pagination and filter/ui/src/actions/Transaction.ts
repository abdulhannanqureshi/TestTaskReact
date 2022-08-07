import { createAction } from 'redux-actions';

export enum TransactionActionTypes {
  GET_TRANSACTION_REQUEST = 'TRANSACTION Requested!',
  GET_TRANSACTION_SUCCESS = 'TRANSACTION data fetch successfully!',
  GET_TRANSACTION_FAILED = 'TRANSACTION request failed!',
  GET_TRANSACTION_REPORT_REQUEST = 'TRANSACTION REPORT Requested!',
  GET_TRANSACTION_REPORT_SUCCESS = 'TRANSACTION REPORT fetch successfully!',
  GET_TRANSACTION_REPORT_FAILED= 'TRANSACTION REPORT request failed!',
}

// get Transaction list
export const getTransactionRequest = createAction(
  TransactionActionTypes.GET_TRANSACTION_REQUEST,
);
export const getTransactionSuccess = createAction<any>(
  TransactionActionTypes.GET_TRANSACTION_SUCCESS,
);
export const getTransactionFailed = createAction(
  TransactionActionTypes.GET_TRANSACTION_FAILED,
);
export const getTransactionReportRequest = createAction(
  TransactionActionTypes.GET_TRANSACTION_REPORT_REQUEST,
);
export const getTransactionReportSuccess = createAction<any>(
  TransactionActionTypes.GET_TRANSACTION_REPORT_SUCCESS,
);
export const getTransactionReportFailed = createAction(
  TransactionActionTypes.GET_TRANSACTION_REPORT_FAILED,
);
 