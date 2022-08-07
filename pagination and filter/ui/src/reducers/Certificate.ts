import { handleActions } from 'redux-actions';
import { CertificateActionTypes } from './../actions';
import { ICertificateModel } from '../interfaces';
import { CertificateInitialState } from '../states';

export const certificateReducer = handleActions<ICertificateModel, any>(
  {
    [CertificateActionTypes.GET_CERTIFICATE_REQUEST]: (state = CertificateInitialState, action) => ({
      ...state,
      isLoading: true,
    }),
    [CertificateActionTypes.GET_CERTIFICATE_SUCCESS]: (state = CertificateInitialState, action) => ({
      ...state,
      currentPage: action.payload.currentPage,
      certificateData: action.payload.certificateData,
      totalRecords: action.payload.totalRecords,
      isLoading: false,
    }),
    [CertificateActionTypes.GET_CERTIFICATE_FAILED]: (state = CertificateInitialState, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),

    
  },
  CertificateInitialState,
);
