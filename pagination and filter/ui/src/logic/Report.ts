import { createLogic } from "redux-logic";
import { toast } from "react-toastify";
import FileSaver from "file-saver";
import moment from "moment";
import { showLoader, hideLoader, ReportActionTypes, getUserReportSuccess, getUserReportFailed, getSaleReportSuccess, getSaleReportFailed } from "../actions";
import { ApiHelper } from "../helper/ApiHelper";
import { ApiRoutes } from "../config";

let toastId: any = null;

const ExportReportLogic = createLogic({
  type: ReportActionTypes.EXPORT_STDUENT_REPORT_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.EXPORT_REPORT.service,
      ApiRoutes.EXPORT_REPORT.url,
      ApiRoutes.EXPORT_REPORT.method,
      ApiRoutes.EXPORT_REPORT.authenticate,
      action.payload,
      undefined,
      "blob"
    );
    if (response && !response.isError) {
      let blob = new Blob([response.data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      FileSaver.saveAs(
        blob,
        moment().format("YYYY_MM_DD") + "_student_report.xlsx"
      );
      dispatch(hideLoader());
      // dispatch(
      //   fetchReportSuccess({
      //     reportData: data,
      //     totalRecords:
      //       totalRecords && totalRecords.length ? totalRecords[0].count : '',
      //   }),
      // );
      done();
    } else {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      // dispatch(
      //   changePasswordFailed({
      //     isError: true,
      //   }),
      // );
      done();
    }
  }
});


const getUserReport = createLogic({
  type: ReportActionTypes.GET_USER_REPORT_REQUEST,
  async process(data, dispatch: any, done) {
    
    const {action} : any = data;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.GET_USER_REPORT.service,
      ApiRoutes.GET_USER_REPORT.url,
      ApiRoutes.GET_USER_REPORT.method,
      ApiRoutes.GET_USER_REPORT.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        getUserReportSuccess({
          userReportData: response.data.data,
          totalRecords: response.data.totalRecords
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(getUserReportFailed());
      done();
    }
  }
});

const getSaleReport = createLogic({
  type: ReportActionTypes.GET_SALE_REPORT_REQUEST,
  async process(data, dispatch: any, done) {
    
    const {action} : any = data;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.GET_SALE_REPORT.service,
      ApiRoutes.GET_SALE_REPORT.url,
      ApiRoutes.GET_SALE_REPORT.method,
      ApiRoutes.GET_SALE_REPORT.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        getSaleReportSuccess({
          saleReportData: response.data.data,
          totalRecords: response.data.totalRecords
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(getSaleReportFailed());
      done();
    }
  }
});


export const reportLogics = [ExportReportLogic, getUserReport, getSaleReport];
