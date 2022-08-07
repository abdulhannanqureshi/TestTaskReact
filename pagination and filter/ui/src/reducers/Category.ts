import { handleActions } from 'redux-actions';
import { CategoryActionTypes } from './../actions';
import { ICategoryModel } from '../interfaces';
import { CategoryInitialState } from '../states';

export const categoryReducer = handleActions<ICategoryModel, any>(
  {
    [CategoryActionTypes.GET_CATEGORY_REQUEST]: (state = CategoryInitialState, action) => ({
      ...state,
      isLoading: true,
    }),
    [CategoryActionTypes.GET_CATEGORY_SUCCESS]: (state = CategoryInitialState, action) => ({
      ...state,
      currentPage: action.payload.currentPage,
      categoryData: action.payload.categoryData,
      totalRecords: action.payload.totalRecords,
      isLoading: false,
    }),
    [CategoryActionTypes.GET_CATEGORY_FAILED]: (state = CategoryInitialState, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),

    /**
     * Add category Reducer
     */
    [CategoryActionTypes.ADD_CATEGORY_REQUEST]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
    [CategoryActionTypes.ADD_CATEGORY_SUCCESS]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
    [CategoryActionTypes.ADD_CATEGORY_FAILED]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),

    /**
     * Category Details
     */
    [CategoryActionTypes.CATEGORY_INFO_REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [CategoryActionTypes.CATEGORY_INFO_SUCCESS]: (state, action) => ({
      ...state,
      categoryInfo: action.payload.categoryInfo,
      isLoading: false,
    }),
    [CategoryActionTypes.CATEGORY_INFO_FAILED]: (state, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),

    /**
     * Update category
     */
    [CategoryActionTypes.UPDATE_CATEGORY_REQUEST]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
    [CategoryActionTypes.UPDATE_CATEGORY_SUCCESS]: (state, action) => ({
      ...state,
      isSuccess: false,
     categoryInfo: action.payload.categoryInfo,
    }),
    [CategoryActionTypes.UPDATE_CATEGORY_FAILED]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
    [CategoryActionTypes.BULK_CATEGORY_ACTION_REQUEST]: (state = CategoryInitialState, action) => ({
      ...state,
      isLoading: true,
    }),
    [CategoryActionTypes.BULK_CATEGORY_ACTION_SUCCESS]: (state = CategoryInitialState, action) => ({
      ...state,
      categoryData: action.payload.categoryData,
      isLoading: false,
    }),
    [CategoryActionTypes.BULK_CATEGORY_ACTION_FAILED]: (state = CategoryInitialState, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),
  },
  CategoryInitialState,
);
