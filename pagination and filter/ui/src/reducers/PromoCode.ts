import { handleActions } from 'redux-actions';
import { PromoCodeActionTypes } from './../actions';
import { IPromoCodeModel } from '../interfaces';
import { PromoCodeInitialState } from '../states';

export const promoCodeReducer = handleActions<IPromoCodeModel, any>(
  {
    [PromoCodeActionTypes.GET_PROMO_CODE_REQUEST]: (state = PromoCodeInitialState, action) => ({
      ...state,
      isLoading: true,
    }),
    [PromoCodeActionTypes.GET_PROMO_CODE_SUCCESS]: (state = PromoCodeInitialState, action) => ({
      ...state,
      currentPage: action.payload.currentPage,
      promoCodeData: action.payload.promoCodeData,
      totalRecords: action.payload.totalRecords,
      isLoading: false,
    }),
    [PromoCodeActionTypes.GET_PROMO_CODE_FAILED]: (state = PromoCodeInitialState, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),

    /**
     * Add promo code reducer
     */
    [PromoCodeActionTypes.ADD_PROMO_CODE_REQUEST]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
    [PromoCodeActionTypes.ADD_PROMO_CODE_SUCCESS]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
    [PromoCodeActionTypes.ADD_PROMO_CODE_FAILED]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),

    /**
     * Promo code details
     */
    [PromoCodeActionTypes.PROMO_CODE_INFO_REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [PromoCodeActionTypes.PROMO_CODE_INFO_SUCCESS]: (state, action) => ({
      ...state,
      promoCodeInfo: action.payload.promoCodeInfo,
      isLoading: false,
    }),
    [PromoCodeActionTypes.PROMO_CODE_INFO_FAILED]: (state, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),

    /**
     * Update promo code
     */
    [PromoCodeActionTypes.UPDATE_PROMO_CODE_REQUEST]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
    [PromoCodeActionTypes.UPDATE_PROMO_CODE_SUCCESS]: (state, action) => ({
      ...state,
      isSuccess: false,
     promoCodeInfo: action.payload.promoCodeInfo,
    }),
    [PromoCodeActionTypes.UPDATE_PROMO_CODE_FAILED]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
  },
  PromoCodeInitialState,
);
