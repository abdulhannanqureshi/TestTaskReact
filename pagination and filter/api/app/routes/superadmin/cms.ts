import express from 'express';
import { getCms, updateCms, viewCms } from './../../controllers/superadmin';
import { ValidateAdminToken } from '../../common';
import { EmailTemplateValidation } from '../../validations';

const CmsRouter: express.Router = express.Router();

CmsRouter.get('/', ValidateAdminToken, getCms);
CmsRouter.get('/:id', ValidateAdminToken, viewCms);
CmsRouter.put(
  '/:id',
  ValidateAdminToken,

  updateCms
);

export default CmsRouter;
