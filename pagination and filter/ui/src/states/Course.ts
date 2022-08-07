import { ICourseModel } from "../interfaces";

export const CourseInitialState: ICourseModel = {
  isLoading: true,
  categoryData: [],
  courseData: [],
  courseInfo: {
    topicName: "",
    title: "",
    code: "",
    price: "",
    topic: "",
    isActive: true,
  },
  isError: false,
  totalRecords: 0,
};
