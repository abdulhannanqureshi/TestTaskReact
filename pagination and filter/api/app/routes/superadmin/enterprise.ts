import express from 'express';
import { AddEnterpriseValidation } from '../../validations';
import {
  getEnterprises,
  addEnterprise,
  viewEnterprise,
  deleteEnterprise,
} from '../../controllers/superadmin';
import { ValidateAdminToken } from '../../common';
const EnterpriseRouter: express.Router = express.Router();

EnterpriseRouter.post(
  '/',
  ValidateAdminToken,
  AddEnterpriseValidation,
  addEnterprise
);
EnterpriseRouter.get('/', ValidateAdminToken, getEnterprises);
EnterpriseRouter.get('/:id', ValidateAdminToken, viewEnterprise);
EnterpriseRouter.delete('/:id', ValidateAdminToken, deleteEnterprise);

export default EnterpriseRouter;
