import { createAction } from 'redux-actions';

export enum CertificateActionTypes {
  GET_CERTIFICATE_REQUEST = 'CERTIFICATE Requested!',
  GET_CERTIFICATE_SUCCESS = 'CERTIFICATE data fetch successfully!',
  GET_CERTIFICATE_FAILED = 'CERTIFICATE request failed!',
  UPDATE_CERTIFICATE_STATUS_REQUEST = 'UPDATE CERTIFICATE_STATUS Requested!',
  UPDATE_CERTIFICATE_STATUS_SUCCESS = 'UPDATE CERTIFICATE_STATUS successfully!',
  UPDATE_CERTIFICATE_STATUS_FAILED = 'UPDATE CERTIFICATE_STATUS failed!',
}

// get certificate list
export const getCertificateRequest = createAction(
  CertificateActionTypes.GET_CERTIFICATE_REQUEST,
);
export const getCertificateSuccess = createAction<any>(
  CertificateActionTypes.GET_CERTIFICATE_SUCCESS,
);
export const getCertificateFailed = createAction(
  CertificateActionTypes.GET_CERTIFICATE_FAILED,
);


/**
 * Certificate status 
 */
 export const certificateStatusRequest = createAction(
  CertificateActionTypes.UPDATE_CERTIFICATE_STATUS_REQUEST,
);
export const certificateStatusSuccess = createAction(
  CertificateActionTypes.UPDATE_CERTIFICATE_STATUS_SUCCESS,
);
export const certificateStatusFailed = createAction(
  CertificateActionTypes.UPDATE_CERTIFICATE_STATUS_FAILED,
);