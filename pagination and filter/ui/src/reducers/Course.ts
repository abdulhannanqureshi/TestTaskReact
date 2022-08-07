import { handleActions } from 'redux-actions';
import { CourseActionTypes } from './../actions';
import { ICourseModel } from '../interfaces';
import { CourseInitialState } from '../states';

export const courseReducer = handleActions<ICourseModel, any>(
  {
    [CourseActionTypes.GET_TOPICS_LIST_REQUEST]: (state = CourseInitialState, action) => ({
      ...state,
      isLoading: true,
    }),
    [CourseActionTypes.GET_TOPICS_LIST_SUCCESS]: (state = CourseInitialState, action) => ({
      ...state,
      courseTopicData:action.payload.courseTopicData,
      // userData: action.payload.userData,
      // totalRecords: action.payload.totalRecords,
      isLoading: false,
    }),
    [CourseActionTypes.GET_TOPICS_LIST_FAILED]: (state = CourseInitialState, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),
    /**
     * Get Course 
     */
    [CourseActionTypes.GET_COURSE_REQUEST]: (state = CourseInitialState, action) => ({
      ...state,
      isLoading: true,
    }),
    [CourseActionTypes.GET_COURSE_SUCCESS]: (state = CourseInitialState, action) => ({
      ...state,
      courseData: action.payload.courseData,
      totalRecords: action.payload.totalRecords,
      isLoading: false,
    }),
    [CourseActionTypes.GET_COURSE_FAILED]: (state = CourseInitialState, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),
    /**
     * Course Details
     */    
    [CourseActionTypes.ADD_COURSE_REQUEST]: (state = CourseInitialState, action) => ({
      ...state,
      isLoading: true,
    }),
    [CourseActionTypes.ADD_COURSE_SUCCESS]: (state = CourseInitialState, action) => ({
      ...state,
      courseTopicData:action.payload.courseTopicData,
      courseData: action.payload.userData,
      totalRecords: action.payload.totalRecords,
      isLoading: false,
    }),
    [CourseActionTypes.ADD_COURSE_FAILED]: (state = CourseInitialState, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),
    /**
     * Update Course Details
     */    
     [CourseActionTypes.UPDATE_COURSE_REQUEST]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
    [CourseActionTypes.UPDATE_COURSE_SUCCESS]: (state, action) => ({
      ...state,
      isSuccess: false,
     courseInfo: action.payload.courseInfo,
    }),
    [CourseActionTypes.UPDATE_COURSE_FAILED]: (state, action) => ({
      ...state,
      isSuccess: false,
    }),
    /**
     * Course Details
     */
     [CourseActionTypes.COURSE_INFO_REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [CourseActionTypes.COURSE_INFO_SUCCESS]: (state, action) => ({
      ...state,
      courseInfo: action.payload.courseInfo,
      isLoading: false,
    }),
    [CourseActionTypes.COURSE_INFO_FAILED]: (state, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),
  },
  CourseInitialState,
);
