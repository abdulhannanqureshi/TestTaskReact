import express from "express";
import { getCourseTopics, getCourseTopicInfo } from "../../controllers/frontend";
const CourseTopicRouter: express.Router = express.Router();

CourseTopicRouter.get("/", getCourseTopics);
CourseTopicRouter.get("/:id", getCourseTopicInfo);

export default CourseTopicRouter;
