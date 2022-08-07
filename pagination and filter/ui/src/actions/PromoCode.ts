import { createAction } from 'redux-actions';

export enum PromoCodeActionTypes {
  GET_PROMO_CODE_REQUEST = 'PROMO CODE Requested!',
  GET_PROMO_CODE_SUCCESS = 'PROMO CODE data fetch successfully!',
  GET_PROMO_CODE_FAILED = 'PROMO CODE request failed!',
  ADD_PROMO_CODE_REQUEST = "Add PROMO CODE Request!",
  ADD_PROMO_CODE_SUCCESS = "Add PROMO CODE Succesfully!",
  ADD_PROMO_CODE_FAILED = "Add PROMO CODE Request Failed!",
  PROMO_CODE_INFO_REQUEST = "PROMO CODE info Request!",
  PROMO_CODE_INFO_SUCCESS = "PROMO CODE Info Request!",
  PROMO_CODE_INFO_FAILED = "PROMO CODE Info Failed!",
  PROMO_CODE_DELETE_REQUEST = "PROMO CODE delete Request!",
  PROMO_CODE_DELETE_SUCCESS = "PROMO CODE delete Request!",
  PROMO_CODE_DELETE_FAILED = "PROMO CODE delete Failed!",
  UPDATE_PROMO_CODE_REQUEST = "Update PROMO CODE Request!",
  UPDATE_PROMO_CODE_SUCCESS = "Update PROMO CODE Success!",
  UPDATE_PROMO_CODE_FAILED = "Update PROMO CODE request Failed!",
  UPDATE_PROMO_CODE_STATUS_REQUEST = 'UPDATE PROMO CODE success Requested!',
  UPDATE_PROMO_CODE_STATUS_SUCCESS = 'UPDATE PROMO_CODE_STATUS successfully!',
  UPDATE_PROMO_CODE_STATUS_FAILED = 'UPDATE PROMO_CODE_STATUS failed!',
  BULK_PROMO_CODE_ACTION_REQUEST = 'BULK PROMO CODE ACTION Requested!',
  BULK_PROMO_CODE_ACTION_SUCCESS = 'BULK PROMO CODE ACTION data fetch successfully!',
  BULK_PROMO_CODE_ACTION_FAILED = 'BULK PROMO CODE ACTION request failed!',
}

// get promo code list
export const getPromoCodeRequest = createAction(
  PromoCodeActionTypes.GET_PROMO_CODE_REQUEST,
);
export const getPromoCodeSuccess = createAction<any>(
  PromoCodeActionTypes.GET_PROMO_CODE_SUCCESS,
);
export const getPromoCodeFailed = createAction(
  PromoCodeActionTypes.GET_PROMO_CODE_FAILED,
);

/**
 * Add promo code
 */
export const addPromoCodeRequest = createAction(
  PromoCodeActionTypes.ADD_PROMO_CODE_REQUEST,
);
export const addPromoCodeSuccess = createAction(
  PromoCodeActionTypes.ADD_PROMO_CODE_SUCCESS,
);
export const addPromoCodeFailed = createAction(
  PromoCodeActionTypes.ADD_PROMO_CODE_FAILED,
);

/**
 * Promo code informations
 */
export const promoCodeInfoRequest = createAction(
  PromoCodeActionTypes.PROMO_CODE_INFO_REQUEST,
);
export const promoCodeInfoSuccess = createAction(
  PromoCodeActionTypes.PROMO_CODE_INFO_SUCCESS,
);
export const promoCodeInfoFailed = createAction(
  PromoCodeActionTypes.PROMO_CODE_INFO_FAILED,
);

/**
 * Update promo code
 */

export const updatePromoCodeRequest = createAction(
  PromoCodeActionTypes.UPDATE_PROMO_CODE_REQUEST,
);
export const updatePromoCodeSuccess = createAction(
  PromoCodeActionTypes.UPDATE_PROMO_CODE_SUCCESS,
);
export const updatePromoCodeFailed = createAction(
  PromoCodeActionTypes.UPDATE_PROMO_CODE_FAILED,
);

/**
 * Delete promo code
 */

 export const promoCodeDeleteRequest = createAction(
  PromoCodeActionTypes.PROMO_CODE_DELETE_REQUEST,
);
export const promoCodeDeleteSuccess = createAction(
  PromoCodeActionTypes.PROMO_CODE_DELETE_SUCCESS,
);
export const promoCodeDeleteFailed = createAction(
  PromoCodeActionTypes.PROMO_CODE_DELETE_FAILED,
);

/**
 * Promo code status 
 */
export const promoCodeStatusRequest = createAction(
  PromoCodeActionTypes.UPDATE_PROMO_CODE_STATUS_REQUEST,
);
export const promoCodeStatusSuccess = createAction(
  PromoCodeActionTypes.UPDATE_PROMO_CODE_STATUS_SUCCESS,
);
export const promoCodeStatusFailed = createAction(
  PromoCodeActionTypes.UPDATE_PROMO_CODE_STATUS_FAILED,
);

// get corporation list
export const bulkPromoCodeActionRequest = createAction(
  PromoCodeActionTypes.BULK_PROMO_CODE_ACTION_REQUEST,
);
export const bulkPromoCodeActionSuccess = createAction<any>(
  PromoCodeActionTypes.BULK_PROMO_CODE_ACTION_SUCCESS,
);
export const bulkPromoCodeActionFailed = createAction(
  PromoCodeActionTypes.BULK_PROMO_CODE_ACTION_FAILED,
);