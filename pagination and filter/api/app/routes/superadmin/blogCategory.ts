import express from 'express';
import {
  AddBlogCategoryValidation,
  EditBlogCategoryValidation,
} from '../../validations';
import {
  getBlogCategory,
  addBlogCategory,
  updateBlogCategory,
  updateStatusBlogCategory,
  deleteBlogCategory,
  viewBlogCategory,
} from '../../controllers/superadmin';
import { ValidateAdminToken } from '../../common';
const BlogCategoryRouter: express.Router = express.Router();

BlogCategoryRouter.post(
  '/',
  ValidateAdminToken,
  AddBlogCategoryValidation,
  addBlogCategory
);
BlogCategoryRouter.get('/', ValidateAdminToken, getBlogCategory);
BlogCategoryRouter.put(
  '/:id',
  ValidateAdminToken,
  EditBlogCategoryValidation,
  updateBlogCategory
);

BlogCategoryRouter.put(
  '/update-status/:id',
  ValidateAdminToken,
  updateStatusBlogCategory
);
BlogCategoryRouter.delete('/:id', ValidateAdminToken, deleteBlogCategory);
BlogCategoryRouter.get('/:id', ValidateAdminToken, viewBlogCategory);

export default BlogCategoryRouter;
