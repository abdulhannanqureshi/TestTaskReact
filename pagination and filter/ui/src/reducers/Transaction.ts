import { handleActions } from 'redux-actions';
import { TransactionActionTypes } from './../actions';
import { ITransactionModel } from '../interfaces';
import { TransactionInitialState } from '../states';

export const transactionReducer = handleActions<ITransactionModel, any>(
  {
    [TransactionActionTypes.GET_TRANSACTION_REQUEST]: (state = TransactionInitialState, action) => ({
      ...state,
      isLoading: true,
    }),
    [TransactionActionTypes.GET_TRANSACTION_SUCCESS]: (state = TransactionInitialState, action) => ({
      ...state,
      currentPage: action.payload.currentPage,
      transactionData: action.payload.transactionData,
      totalRecords: action.payload.totalRecords,
      isLoading: false,
    }),
    [TransactionActionTypes.GET_TRANSACTION_FAILED]: (state = TransactionInitialState, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),
    [TransactionActionTypes.GET_TRANSACTION_REPORT_SUCCESS]: (state = TransactionInitialState, action) => ({
      ...state,
      Url_Report: action.payload.Url_Report,
      
    }),

    
  },
  TransactionInitialState,
);
