import { createLogic } from "redux-logic";
import { toast } from "react-toastify";
import { ApiHelper } from "../helper/ApiHelper";
import { ApiRoutes } from "../config";
import { CertificateActionTypes, showLoader, hideLoader, getCertificateSuccess, getCertificateFailed, certificateStatusSuccess, getCertificateRequest, certificateStatusFailed } from "../actions";
import { IRootState } from "../interfaces";

let toastId: any = null;

const getCertificate = createLogic({
  type: CertificateActionTypes.GET_CERTIFICATE_REQUEST,
  async process(data, dispatch: any, done) {
    
    const {action} : any = data;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.GET_CERTIFICATE.service,
      ApiRoutes.GET_CERTIFICATE.url,
      ApiRoutes.GET_CERTIFICATE.method,
      ApiRoutes.GET_CERTIFICATE.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        getCertificateSuccess({
          currentPage: action.payload.skip,
          certificateData: response.data.data,
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
      dispatch(getCertificateFailed());
      done();
    }
  }
});

/**
|--------------------------------------------------
| Update certificate status
|--------------------------------------------------
*/

const updateCertificateStatus = createLogic({
  type: CertificateActionTypes.UPDATE_CERTIFICATE_STATUS_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.UPDATE_CERTIFICATE_STATUS.service,
      ApiRoutes.UPDATE_CERTIFICATE_STATUS.url.replace(":id", action.payload.id),
      ApiRoutes.UPDATE_CERTIFICATE_STATUS.method,
      ApiRoutes.UPDATE_CERTIFICATE_STATUS.authenticate,
      undefined,
      action.payload,
    )
    if (response && !response.isError) {
      dispatch(hideLoader())
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0])
        dispatch(certificateStatusSuccess())
      }
      const state: IRootState = data.getState() as IRootState;
      dispatch(
        getCertificateSuccess({
          certificateData: {
            ...state.certificateReducer.certificateInfo,
            status: action.payload.status,
          },
        }),
      );
      dispatch(getCertificateRequest({ skip: action.payload.skip, limit: action.payload.limit }));
    }
    else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        certificateStatusFailed({
          error: response.messages[0],
        }),
      );
      done();
    }
  }
})

export const certificateLogics = [getCertificate, updateCertificateStatus];
