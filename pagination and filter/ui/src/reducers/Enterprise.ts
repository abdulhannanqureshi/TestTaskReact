import { handleActions } from 'redux-actions';
import { EnterpriseActionTypes } from './../actions';
import { IEnterpriseModel } from '../interfaces';
import { EnterpriseInitialState } from '../states';

export const enterpriseReducer = handleActions<IEnterpriseModel, any>(
  {
    [EnterpriseActionTypes.GET_ENTERPRISE_REQUEST]: (state = EnterpriseInitialState, action) => ({
      ...state,
      isLoading: true,
    }),
    [EnterpriseActionTypes.GET_ENTERPRISE_SUCCESS]: (state = EnterpriseInitialState, action) => ({
      ...state,
      currentPage: action.payload.currentPage,
      enterpriseData: action.payload.enterpriseData,
      totalRecords: action.payload.totalRecords,
      isLoading: false,
    }),
    [EnterpriseActionTypes.GET_ENTERPRISE_FAILED]: (state = EnterpriseInitialState, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),

    
  },
  EnterpriseInitialState,
);
