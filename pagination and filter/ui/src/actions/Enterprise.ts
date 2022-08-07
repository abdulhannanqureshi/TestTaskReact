import { createAction } from 'redux-actions';

export enum EnterpriseActionTypes {
  GET_ENTERPRISE_REQUEST = 'ENTERPRISE Requested!',
  GET_ENTERPRISE_SUCCESS = 'ENTERPRISE data fetch successfully!',
  GET_ENTERPRISE_FAILED = 'ENTERPRISE request failed!',
}

// get enterprise list
export const getEnterpriseRequest = createAction(
  EnterpriseActionTypes.GET_ENTERPRISE_REQUEST,
);
export const getEnterpriseSuccess = createAction<any>(
  EnterpriseActionTypes.GET_ENTERPRISE_SUCCESS,
);
export const getEnterpriseFailed = createAction(
  EnterpriseActionTypes.GET_ENTERPRISE_FAILED,
);

