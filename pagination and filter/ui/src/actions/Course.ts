import { createAction } from 'redux-actions';

export enum CourseActionTypes {
    GET_TOPICS_LIST_REQUEST = 'Topic List Requested!',
    GET_TOPICS_LIST_SUCCESS = 'Topic List Success!',
    GET_TOPICS_LIST_FAILED = 'Topic List Failed!',
    ADD_COURSE_REQUEST = 'Add Course Requested!',
    ADD_COURSE_SUCCESS = 'Add Course Success!',
    ADD_COURSE_FAILED = 'Add Course Failed!',
    UPDATE_COURSE_REQUEST = 'Update Course Requested!',
    UPDATE_COURSE_SUCCESS = 'Update Course Success!',
    UPDATE_COURSE_FAILED = 'Update Course Failed!',
    COURSE_INFO_REQUEST = "COURSE info Request!",
    COURSE_INFO_SUCCESS = "COURSE Info Request!",
    COURSE_INFO_FAILED = "COURSE Info Failed!",
    GET_COURSE_REQUEST = 'Get Course Requested!',
    GET_COURSE_SUCCESS = 'Get Course Success!',
    GET_COURSE_FAILED = 'Get Course Failed!',
    COURSE_DELET_REQUEST = "Course delet Request!",
    COURSE_DELET_SUCCESS = "Course delet Success!",
    COURSE_DELET_FAILED = "Course delet Failed!",
    UPDATE_COURSE_STATUS_REQUEST = 'UPDATE course success Requested!',
    UPDATE_COURSE_STATUS_SUCCESS = 'UPDATE course status successfully!',
    UPDATE_COURSE_STATUS_FAILED = 'UPDATE course status failed!',
    BULK_COURSE_ACTION_REQUEST = 'BULK COURSE ACTION Requested!',
    BULK_COURSE_ACTION_SUCCESS = 'BULK COURSE ACTION data fetch successfully!',
    BULK_COURSE_ACTION_FAILED = 'BULK COURSE ACTION request failed!',
}

export const getTopicListRequest = createAction(
    CourseActionTypes.GET_TOPICS_LIST_REQUEST,
);
export const getTopicListSuccess = createAction<any>(
    CourseActionTypes.GET_TOPICS_LIST_SUCCESS,
);

export const getTopicListFailed = createAction(
    CourseActionTypes.GET_TOPICS_LIST_FAILED,
);

// get course list
export const getCourseRequest = createAction(
    CourseActionTypes.GET_COURSE_REQUEST,
  );
  export const getCourseSuccess = createAction<any>(
    CourseActionTypes.GET_COURSE_SUCCESS,
  );
  export const getCourseFailed = createAction(
    CourseActionTypes.GET_COURSE_FAILED,
  );
  

export const addCourseRequest = createAction(
    CourseActionTypes.ADD_COURSE_REQUEST,
);
export const addCourseSuccess = createAction<any>(
    CourseActionTypes.ADD_COURSE_SUCCESS,
);

export const addCourseFailed = createAction(
    CourseActionTypes.ADD_COURSE_FAILED,
);

/**
 * Course Informations
 */
 export const courseInfoRequest = createAction(
    CourseActionTypes.COURSE_INFO_REQUEST,
  );
  export const courseInfoSuccess = createAction(
    CourseActionTypes.COURSE_INFO_SUCCESS,
  );
  export const courseInfoFailed = createAction(
    CourseActionTypes.COURSE_INFO_FAILED,
  );

  /**
 * Update Course
 */

export const updateCourseRequest = createAction(
    CourseActionTypes.UPDATE_COURSE_REQUEST,
  );
  export const updateCourseSuccess = createAction(
    CourseActionTypes.UPDATE_COURSE_SUCCESS,
  );
  export const updateCourseFailed = createAction(
    CourseActionTypes.UPDATE_COURSE_FAILED,
  );


/**
 * Delete User
 */

 export const courseDeleteRequest = createAction(
    CourseActionTypes.COURSE_DELET_REQUEST,
  );
  export const courseDeleteSuccess = createAction(
    CourseActionTypes.COURSE_DELET_SUCCESS,
  );
  export const courseDeleteFailed = createAction(
    CourseActionTypes.COURSE_DELET_FAILED,
  );
  
  /**
 * User Status 
 */
export const courseStatusRequest = createAction(
    CourseActionTypes.UPDATE_COURSE_STATUS_REQUEST,
  );
  export const courseStatusSuccess = createAction(
    CourseActionTypes.UPDATE_COURSE_STATUS_SUCCESS,
  );
  export const courseStatusFailed = createAction(
    CourseActionTypes.UPDATE_COURSE_STATUS_FAILED,
  ); 

  export const bulkCourseActionRequest = createAction(
    CourseActionTypes.BULK_COURSE_ACTION_REQUEST,
  );
  export const bulkCourseActionSuccess = createAction<any>( 
    CourseActionTypes.BULK_COURSE_ACTION_SUCCESS,
  );
  export const bulkCourseActionFailed = createAction(
    CourseActionTypes.BULK_COURSE_ACTION_FAILED,
  );  