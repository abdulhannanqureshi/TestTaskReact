import { createLogic } from "redux-logic";
import { toast } from "react-toastify";
import { ApiHelper } from "../helper/ApiHelper";
import { ApiRoutes, AppRoutes } from "../config";
import {
  PromoCodeActionTypes,
  showLoader,
  hideLoader,
  getPromoCodeSuccess,
  getPromoCodeFailed,
  addPromoCodeSuccess,
  addPromoCodeFailed,
  promoCodeInfoSuccess,
  promoCodeInfoFailed,
  redirectTo,
  updatePromoCodeSuccess,
  updatePromoCodeFailed,
  getPromoCodeRequest,
  promoCodeStatusSuccess,
  promoCodeStatusFailed,
  promoCodeDeleteSuccess,
  promoCodeDeleteFailed,
  bulkPromoCodeActionSuccess,
  bulkPromoCodeActionFailed
} from "../actions";
import { IRootState } from "../interfaces";

let toastId: any = null;

const getPromoCode = createLogic({
  type: PromoCodeActionTypes.GET_PROMO_CODE_REQUEST,
  async process(data, dispatch: any, done) {
    const { action }: any = data;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.GET_PROMO_CODE.service,
      ApiRoutes.GET_PROMO_CODE.url,
      ApiRoutes.GET_PROMO_CODE.method,
      ApiRoutes.GET_PROMO_CODE.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        getPromoCodeSuccess({
          currentPage: action.payload.skip,
          promoCodeData: response.data.data,
          totalRecords: response.data.totalRecords,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(getPromoCodeFailed());
      done();
    }
  },
});

const addPromoCode = createLogic({
  type: PromoCodeActionTypes.ADD_PROMO_CODE_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.ADD_PROMO_CODE.service,
      ApiRoutes.ADD_PROMO_CODE.url,
      ApiRoutes.ADD_PROMO_CODE.method,
      ApiRoutes.ADD_PROMO_CODE.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        addPromoCodeSuccess({
          promoCodeData: response.data.data,
        })
      );
      dispatch(
        redirectTo({
          path: AppRoutes.PROMO_CODE,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(addPromoCodeFailed());
      done();
    }
  },
});

const updatePromoCode = createLogic({
  type: PromoCodeActionTypes.UPDATE_PROMO_CODE_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.UPDATE_PROMO_CODE.service,
      ApiRoutes.UPDATE_PROMO_CODE.url.replace(":id", action.payload._id),
      ApiRoutes.UPDATE_PROMO_CODE.method,
      ApiRoutes.UPDATE_PROMO_CODE.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        updatePromoCodeSuccess({
          promoCodeInfo: response.data.data,
        })
      );
      dispatch(
        redirectTo({
          path: AppRoutes.PROMO_CODE,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(updatePromoCodeFailed());
      done();
    }
  },
});

const viewPromoCode = createLogic({
  type: PromoCodeActionTypes.PROMO_CODE_INFO_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.VIEW_PROMO_CODE.service,
      ApiRoutes.VIEW_PROMO_CODE.url.replace(":id", action.payload.id),
      ApiRoutes.VIEW_PROMO_CODE.method,
      ApiRoutes.VIEW_PROMO_CODE.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        promoCodeInfoSuccess({
          promoCodeInfo: response.data.data,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(promoCodeInfoFailed());
      done();
    }
  },
});

/**
|--------------------------------------------------
| Update promo code status
|--------------------------------------------------
*/

const updatePromoCodeStatus = createLogic({
  type: PromoCodeActionTypes.UPDATE_PROMO_CODE_STATUS_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.UPDATE_PROMO_CODE_STATUS.service,
      ApiRoutes.UPDATE_PROMO_CODE_STATUS.url.replace(":id", action.payload.id),
      ApiRoutes.UPDATE_PROMO_CODE_STATUS.method,
      ApiRoutes.UPDATE_PROMO_CODE_STATUS.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
        dispatch(promoCodeStatusSuccess());
      }
      const state: IRootState = data.getState() as IRootState;
      dispatch(
        promoCodeInfoSuccess({
          promoCodeData: {
            ...state.promoCodeReducer.promoCodeInfo,
            isActive: action.payload.isActive,
          },
        })
      );
      dispatch(
        getPromoCodeRequest({
          skip: action.payload.skip,
          limit: action.payload.limit,
        })
      );
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        promoCodeStatusFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});

/**
|--------------------------------------------------
| Update promo code status
|--------------------------------------------------
*/

const deletePromoCode = createLogic({
  type: PromoCodeActionTypes.PROMO_CODE_DELETE_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    if (action.payload === undefined) return false;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.DELETE_PROMO_CODE.service,
      ApiRoutes.DELETE_PROMO_CODE.url.replace(":id", action.payload.id),
      ApiRoutes.DELETE_PROMO_CODE.method,
      ApiRoutes.DELETE_PROMO_CODE.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
        dispatch(promoCodeDeleteSuccess());
      }
      dispatch(
        getPromoCodeSuccess({
          promoCodeData: response.data.data,
          totalRecords: response.data.totalRecords,
        })
      );
      dispatch(
        getPromoCodeRequest({
          skip: action.payload.skip,
          limit: action.payload.limit,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        promoCodeDeleteFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});

const bulkPromoCodeAction = createLogic({
  type: PromoCodeActionTypes.BULK_PROMO_CODE_ACTION_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.PROMOCODE_BULK_ACTION.service,
      ApiRoutes.PROMOCODE_BULK_ACTION.url,
      ApiRoutes.PROMOCODE_BULK_ACTION.method,
      ApiRoutes.PROMOCODE_BULK_ACTION.authenticate,
      undefined,
      action.payload,
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
        dispatch(bulkPromoCodeActionSuccess(""));
      }
      const state: IRootState = data.getState() as IRootState;
      dispatch(
        getPromoCodeSuccess({
          userData: {
            ...state.userReducer.userInfo,
            isActive: action.payload.isActive,
          },
        })
      );
      dispatch(
        getPromoCodeRequest({
          skip: action.payload.skip,
          limit: action.payload.limit,
        })
      );
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        bulkPromoCodeActionFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});
export const promoCodeLogics = [
  getPromoCode,
  addPromoCode,
  viewPromoCode,
  updatePromoCode,
  deletePromoCode,
  updatePromoCodeStatus,
  bulkPromoCodeAction
];
