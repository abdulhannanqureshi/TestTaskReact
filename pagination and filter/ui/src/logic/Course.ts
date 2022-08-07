import { createLogic } from "redux-logic";
import { toast } from "react-toastify";
import { ApiHelper } from "../helper/ApiHelper";
import { ApiRoutes, AppRoutes } from "../config";
import {
  CourseActionTypes,
  showLoader,
  hideLoader,
  getTopicListSuccess,
  getTopicListFailed,
  addCourseSuccess,
  addCourseFailed,
  getCourseSuccess,
  getCourseFailed,
  courseInfoSuccess,
  courseInfoFailed,
  updateCourseSuccess,
  updateCourseFailed,
  courseDeleteSuccess,
  getCourseRequest,
  courseDeleteFailed,
  courseStatusSuccess,
  courseStatusFailed,
  redirectTo,
  bulkCourseActionFailed,
  bulkCourseActionSuccess
} from "../actions";
import { IRootState } from "../interfaces";

let toastId: any = null;

const getCourseTopicList = createLogic({
  type: CourseActionTypes.GET_TOPICS_LIST_REQUEST,
  async process(data, dispatch: any, done) {
    const { action }: any = data;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.GET_COURSE_TOPICS.service,
      ApiRoutes.GET_COURSE_TOPICS.url,
      ApiRoutes.GET_COURSE_TOPICS.method,
      ApiRoutes.GET_COURSE_TOPICS.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        getTopicListSuccess({
          // courseData: response.data.data,
          // totalRecords: response.data.totalRecords
          courseTopicData: response.data.data,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(getTopicListFailed());
      done();
    }
  },
});

const getCourse = createLogic({
  type: CourseActionTypes.GET_COURSE_REQUEST,
  async process(data, dispatch: any, done) {
    const { action }: any = data;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.GET_COURSE.service,
      ApiRoutes.GET_COURSE.url,
      ApiRoutes.GET_COURSE.method,
      ApiRoutes.GET_COURSE.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        getCourseSuccess({
          courseData: response.data.data,
          totalRecords: response.data.totalRecords,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(getCourseFailed());
      done();
    }
  },
});

const addCourse = createLogic({
  type: CourseActionTypes.ADD_COURSE_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.ADD_COURSE.service,
      ApiRoutes.ADD_COURSE.url,
      ApiRoutes.ADD_COURSE.method,
      ApiRoutes.ADD_COURSE.authenticate,
      undefined,
      action.payload,
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        addCourseSuccess({
          courseData: response.data.data,
        })
      );
      dispatch(
        redirectTo({
          path: AppRoutes.COURSE,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(addCourseFailed());
      done();
    }
  },
});

const viewCourse = createLogic({
  type: CourseActionTypes.COURSE_INFO_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.VIEW_COURSE.service,
      ApiRoutes.VIEW_COURSE.url.replace(":id", action.payload.id),
      ApiRoutes.VIEW_COURSE.method,
      ApiRoutes.VIEW_COURSE.authenticate,
      action.payload,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        courseInfoSuccess({
          courseInfo: response.data.data,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(courseInfoFailed());
      done();
    }
  },
});

const updateCourse = createLogic({
  type: CourseActionTypes.UPDATE_COURSE_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.UPDATE_COURSE.service,
      ApiRoutes.UPDATE_COURSE.url.replace(":id", action.payload._id),
      ApiRoutes.UPDATE_COURSE.method,
      ApiRoutes.UPDATE_COURSE.authenticate,
      undefined,
      action.payload,
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        updateCourseSuccess({
          courseInfo: response.data.data,
        })
      );
      dispatch(
        redirectTo({
          path: AppRoutes.COURSE,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(updateCourseFailed());
      done();
    }
  },
});

/**
|--------------------------------------------------
| Delete Course
|--------------------------------------------------
*/

const deleteCourse = createLogic({
  type: CourseActionTypes.COURSE_DELET_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.DELETE_COURSE.service,
      ApiRoutes.DELETE_COURSE.url.replace(":id", action.payload.id),
      ApiRoutes.DELETE_COURSE.method,
      ApiRoutes.DELETE_COURSE.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
        dispatch(courseDeleteSuccess());
      }
      dispatch(
        getCourseSuccess({
          courseData: response.data.data,
          totalRecords: response.data.totalRecords,
        })
      );
      dispatch(
        getCourseRequest({
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
        courseDeleteFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});

/**
|--------------------------------------------------
| Update Course Status
|--------------------------------------------------
*/

const updateCourseStatus = createLogic({
  type: CourseActionTypes.UPDATE_COURSE_STATUS_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.UPDATE_COURSE_STATUS.service,
      ApiRoutes.UPDATE_COURSE_STATUS.url.replace(":id", action.payload.id),
      ApiRoutes.UPDATE_COURSE_STATUS.method,
      ApiRoutes.UPDATE_COURSE_STATUS.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
        dispatch(courseStatusSuccess());
      }
      const state: IRootState = data.getState() as IRootState;
      dispatch(
        courseInfoSuccess({
          courseData: {
            ...state.courseReducer.courseInfo,
            isActive: action.payload.isActive,
          },
        })
      );
      dispatch(
        getCourseRequest({
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
        courseStatusFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});
const bulkCourseAction = createLogic({
  type:  CourseActionTypes.BULK_COURSE_ACTION_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.COURSE_BULK_ACTION.service,
      ApiRoutes.COURSE_BULK_ACTION.url,
      ApiRoutes.COURSE_BULK_ACTION.method,
      ApiRoutes.COURSE_BULK_ACTION.authenticate,
      undefined,
      action.payload,
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
        dispatch(bulkCourseActionSuccess(""));
      }
      const state: IRootState = data.getState() as IRootState;
      dispatch(
        courseInfoSuccess({
          userData: {
            ...state.userReducer.userInfo,
            isActive: action.payload.isActive,
          },
        })
      );
      dispatch(
        getCourseRequest({
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
        bulkCourseActionFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  }, 
});
export const courseLogics = [
  getCourseTopicList,
  addCourse,
  getCourse,
  viewCourse,
  updateCourse,
  deleteCourse,
  updateCourseStatus,
  bulkCourseAction
];
