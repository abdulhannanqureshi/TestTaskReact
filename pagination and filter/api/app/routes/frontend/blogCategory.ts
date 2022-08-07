import express from "express";

import { getBlogCategory,viewBlogCategory } from "../../controllers/frontend";
import { ValidateUserToken } from '../../common';
const BlogCategoryRouter: express.Router = express.Router();

BlogCategoryRouter.get("/",  getBlogCategory);
BlogCategoryRouter.get("/:id",  viewBlogCategory);

export default BlogCategoryRouter;
