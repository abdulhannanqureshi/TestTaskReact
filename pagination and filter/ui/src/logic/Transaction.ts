import { createLogic } from "redux-logic";
import { toast } from "react-toastify";
import { ApiHelper } from "../helper/ApiHelper";
import { ApiRoutes } from "../config";
import fileDownload from "js-file-download"
import {
  TransactionActionTypes,
  showLoader,
  hideLoader,
  getTransactionSuccess,
  getTransactionFailed,
  getTransactionReportSuccess,
  getTransactionReportFailed
} from "../actions";

let toastId: any = null;

const getTransactions = createLogic({
  type: TransactionActionTypes.GET_TRANSACTION_REQUEST,
  async process(data, dispatch: any, done) {

    const { action }: any = data;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.GET_TRANSACTION.service,
      ApiRoutes.GET_TRANSACTION.url,
      ApiRoutes.GET_TRANSACTION.method,
      ApiRoutes.GET_TRANSACTION.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        getTransactionSuccess({
          currentPage: action.payload.skip,
          transactionData: response.data.data,
          totalRecords: response.data.totalRecords
        })
      );
      done();
    } else {
      console.log(response);
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(getTransactionFailed());
      done();
    }
  }
});
const getTransactionsReport = createLogic({
  type: TransactionActionTypes.GET_TRANSACTION_REPORT_REQUEST,
  async process(data, dispatch: any, done) {

    const { action }: any = data;
    // dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.GET_TRANSATION_REPORTS.service,
      ApiRoutes.GET_TRANSATION_REPORTS.url,
      ApiRoutes.GET_TRANSATION_REPORTS.method,
      ApiRoutes.GET_TRANSATION_REPORTS.authenticate,
      action.payload,
      undefined
    );
    console.log(response,"this is response")
    if (response && !response.isError) {
      fileDownload(response.data, 'coinifide_transaction.csv');
      // dispatch(
      //   getTransactionReportSuccess(response)
      // );
      done();
    } else {
      console.log(response);
     
      done();
    }
  }
});

export const transactionLogics = [getTransactions, getTransactionsReport];
