import { handleActions } from 'redux-actions';
import { BlogActionTypes } from './../actions';
import { IBlogModel } from '../interfaces';
import { BlogInitialState } from '../states';

export const blogReducer = handleActions<IBlogModel, any>(
  {
    [BlogActionTypes.GET_BLOG_REQUEST]: (state = BlogInitialState, action) => ({
      ...state,
      isLoading: true,
    }),
    [BlogActionTypes.GET_BLOG_SUCCESS]: (state = BlogInitialState, action) => ({
      ...state,
      blogData: action.payload.blogData,
      totalRecords: action.payload.totalRecords,
      isLoading: false,
    }),
    [BlogActionTypes.GET_BLOG_FAILED]: (state = BlogInitialState, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),

    /**
     * Add Student Reducer
     */
    [BlogActionTypes.ADD_BLOG_REQUEST]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
    [BlogActionTypes.ADD_BLOG_SUCCESS]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
    [BlogActionTypes.ADD_BLOG_FAILED]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),

    /**
     * Student Details
     */
    [BlogActionTypes.BLOG_INFO_REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [BlogActionTypes.BLOG_INFO_SUCCESS]: (state, action) => ({
      ...state,
      blogInfo: action.payload.blogInfo,
      isLoading: false,
    }),
    [BlogActionTypes.BLOG_INFO_FAILED]: (state, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),

    /**
     * Update Student
     */
    [BlogActionTypes.UPDATE_BLOG_REQUEST]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
    [BlogActionTypes.UPDATE_BLOG_SUCCESS]: (state, action) => ({
      ...state,
      isSuccess: false,
     blogInfo: action.payload.blogInfo,
    }),
    [BlogActionTypes.UPDATE_BLOG_FAILED]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
  },
  BlogInitialState,
);
