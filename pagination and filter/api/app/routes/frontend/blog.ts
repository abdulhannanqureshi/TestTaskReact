import express from "express";

import { getBlogs, viewBlog } from "../../controllers/frontend";
import { ValidateUserToken } from '../../common';
const BlogRouter: express.Router = express.Router();


BlogRouter.get("/",  getBlogs);
BlogRouter.get("/:id",  viewBlog);


export default BlogRouter;
