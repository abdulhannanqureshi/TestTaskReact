import { createAction } from 'redux-actions';

export enum ModuleActionTypes {
  GET_MODULE_REQUEST = 'Module Requested!',
  GET_MODULE_SUCCESS = 'Module data fetch successfully!',
  GET_MODULE_FAILED = 'Module request failed!',
  ADD_MODULE_REQUEST = "Add module Request!",
  ADD_MODULE_SUCCESS = "Add module Succesfully!",
  ADD_MODULE_FAILED = "Add module Request Failed!",
  MODULE_INFO_REQUEST = "Module info Request!",
  MODULE_INFO_SUCCESS = "Module Info Request!",
  MODULE_INFO_FAILED = "Module Info Failed!",
  MODULE_DELET_REQUEST = "Module delet Request!",
  MODULE_DELET_SUCCESS = "Module delet Success!",
  MODULE_DELET_FAILED = "Module delet Failed!",
  UPDATE_MODULE_REQUEST = "Update module Request!",
  UPDATE_MODULE_SUCCESS = "Update module Success!",
  UPDATE_MODULE_FAILED = "Update module request Failed!",
  UPDATE_MODULE_STATUS_REQUEST = 'UPDATE module success Requested!',
  UPDATE_MODULE_STATUS_SUCCESS = 'UPDATE module status successfully!',
  UPDATE_MODULE_STATUS_FAILED = 'UPDATE module status failed!',
  BULK_MODULE_ACTION_REQUEST = 'BULK MODULE ACTION Requested!',
  BULK_MODULE_ACTION_SUCCESS = 'BULK MODULE ACTION data fetch successfully!',
  BULK_MODULE_ACTION_FAILED = 'BULK MODULE ACTION request failed!',
  TALENT_LMS_API_REQUEST = 'TALENT LMS API Requested!',
  TALENT_LMS_API_SUCCESS = 'TALENT LMS API fetch successfully!',
  TALENT_LMS_API_FAILED = 'TALENT LMS API request failed!',

}

// get module list
export const getModuleRequest = createAction(
  ModuleActionTypes.GET_MODULE_REQUEST,
);
export const getModuleSuccess = createAction<any>(
  ModuleActionTypes.GET_MODULE_SUCCESS,
);
export const getModuleFailed = createAction(
  ModuleActionTypes.GET_MODULE_FAILED,
);

/**
 * Add User
 */
export const addModuleRequest = createAction(
  ModuleActionTypes.ADD_MODULE_REQUEST,
);
export const addModuleSuccess = createAction(
  ModuleActionTypes.ADD_MODULE_SUCCESS,
);
export const addModuleFailed = createAction(
  ModuleActionTypes.ADD_MODULE_FAILED,
);

/**
 * User Informations
 */
export const moduleInfoRequest = createAction(
  ModuleActionTypes.MODULE_INFO_REQUEST,
);
export const moduleInfoSuccess = createAction(
  ModuleActionTypes.MODULE_INFO_SUCCESS,
);
export const moduleInfoFailed = createAction(
  ModuleActionTypes.MODULE_INFO_FAILED,
);

/**
 * Update User
 */

export const updateModuleRequest = createAction(
  ModuleActionTypes.UPDATE_MODULE_REQUEST,
);
export const updateModuleSuccess = createAction(
  ModuleActionTypes.UPDATE_MODULE_SUCCESS,
);
export const updateModuleFailed = createAction(
  ModuleActionTypes.UPDATE_MODULE_FAILED,
);

/**
 * Delete User
 */

 export const moduleDeleteRequest = createAction(
  ModuleActionTypes.MODULE_DELET_REQUEST,
);
export const moduleDeleteSuccess = createAction(
  ModuleActionTypes.MODULE_DELET_SUCCESS,
);
export const moduleDeleteFailed = createAction(
  ModuleActionTypes.MODULE_DELET_FAILED,
);

/**
 * User Status 
 */
export const moduleStatusRequest = createAction(
  ModuleActionTypes.UPDATE_MODULE_STATUS_REQUEST,
);
export const moduleStatusSuccess = createAction(
  ModuleActionTypes.UPDATE_MODULE_STATUS_SUCCESS,
);
export const moduleStatusFailed = createAction(
  ModuleActionTypes.UPDATE_MODULE_STATUS_FAILED,
);
export const bulkModuleActionRequest = createAction(
  ModuleActionTypes.BULK_MODULE_ACTION_REQUEST,
);
export const bulkModuleActionSuccess = createAction<any>( 
  ModuleActionTypes.BULK_MODULE_ACTION_SUCCESS,
);
export const bulkModuleActionFailed = createAction(
  ModuleActionTypes.BULK_MODULE_ACTION_FAILED,
);  

// actions for talent lms apis
export const TalentLmsApiRequest = createAction(
  ModuleActionTypes.TALENT_LMS_API_REQUEST,
);
export const TalentLmsApiSuccess = createAction<any>( 
  ModuleActionTypes.TALENT_LMS_API_SUCCESS,
);
export const TalentLmsApiFailed = createAction(
  ModuleActionTypes.TALENT_LMS_API_FAILED,
);   
