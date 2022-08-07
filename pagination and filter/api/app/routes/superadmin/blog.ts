import express from 'express';
import { AddBlogValidation, EditBlogValidation } from '../../validations';
import {
  getBlogs,
  addBlog,
  updateBlog,
  viewBlog,
  updateBlogStatus,
  blogBulkAction,
  deleteBlog,
} from '../../controllers/superadmin';
import { ValidateAdminToken, upload } from '../../common';
const UserRouter: express.Router = express.Router();

UserRouter.post(
  '/',
  ValidateAdminToken,
  upload.single('blogFeatureImage'),
  AddBlogValidation,
  addBlog
);
UserRouter.get('/', ValidateAdminToken, getBlogs);
UserRouter.get('/:id', ValidateAdminToken, viewBlog);
UserRouter.put('/bulk-action', ValidateAdminToken, blogBulkAction);
UserRouter.put(
  '/:id',
  ValidateAdminToken,
  upload.single('blogFeatureImage'),
  EditBlogValidation,
  updateBlog
);
UserRouter.put('/update-status/:id', ValidateAdminToken, updateBlogStatus);
UserRouter.delete('/:id', ValidateAdminToken, deleteBlog);

export default UserRouter;
