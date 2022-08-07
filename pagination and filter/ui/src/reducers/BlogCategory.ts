import { handleActions } from 'redux-actions';
import { BlogCategoryActionTypes } from './../actions';
import { IBlogCategoryModel } from '../interfaces';
import { BlogCategoryInitialState } from '../states';

export const blogCategoryReducer = handleActions<IBlogCategoryModel, any>(
  {
    [BlogCategoryActionTypes.GET_BLOG_CATEGORY_REQUEST]: (state = BlogCategoryInitialState, action) => ({
      ...state,
      isLoading: true,
    }),
    [BlogCategoryActionTypes.GET_BLOG_CATEGORY_SUCCESS]: (state = BlogCategoryInitialState, action) => ({
      ...state,
      blogCategoryData: action.payload.blogCategoryData,
      totalRecords: action.payload.totalRecords,
      isLoading: false,
    }),
    [BlogCategoryActionTypes.GET_BLOG_CATEGORY_FAILED]: (state = BlogCategoryInitialState, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),

    /**
     * Add Student Reducer
     */
    [BlogCategoryActionTypes.ADD_BLOG_CATEGORY_REQUEST]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
    [BlogCategoryActionTypes.ADD_BLOG_CATEGORY_SUCCESS]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
    [BlogCategoryActionTypes.ADD_BLOG_CATEGORY_FAILED]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),

    /**
     * Student Details
     */
    [BlogCategoryActionTypes.BLOG_CATEGORY_INFO_REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [BlogCategoryActionTypes.BLOG_CATEGORY_INFO_SUCCESS]: (state, action) => ({
      ...state,
      blogCategoryInfo: action.payload.blogCategoryInfo,
      isLoading: false,
    }),
    [BlogCategoryActionTypes.BLOG_CATEGORY_INFO_FAILED]: (state, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),

    /**
     * Update Student
     */
    [BlogCategoryActionTypes.UPDATE_BLOG_CATEGORY_REQUEST]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
    [BlogCategoryActionTypes.UPDATE_BLOG_CATEGORY_SUCCESS]: (state, action) => ({
      ...state,
      isSuccess: false,
     blogCategoryInfo: action.payload.blogCategoryInfo,
    }),
    [BlogCategoryActionTypes.UPDATE_BLOG_CATEGORY_FAILED]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
  },
  BlogCategoryInitialState,
);
