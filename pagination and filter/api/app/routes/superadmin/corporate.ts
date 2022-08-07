import express from 'express';
import {
  AddCorporateValidation,
  EditCorporateValidation,
} from '../../validations';
import {
  addCorporate,
  updateCorporate,
  getCorporateList,
  viewCorporate,
  deleteCorporate,
  updateStatusCorporate,
} from '../../controllers/superadmin';
import { ValidateAdminToken } from '../../common';
const CorporateRouter: express.Router = express.Router();

CorporateRouter.post(
  '/',
  ValidateAdminToken,
  AddCorporateValidation,
  addCorporate
);
CorporateRouter.get('/', ValidateAdminToken, getCorporateList);
CorporateRouter.get('/:id', ValidateAdminToken, viewCorporate);
CorporateRouter.put(
  '/:id',
  ValidateAdminToken,
  EditCorporateValidation,
  updateCorporate
);
CorporateRouter.put(
  '/update-status/:id',
  ValidateAdminToken,
  updateStatusCorporate
);
CorporateRouter.delete('/:id', ValidateAdminToken, deleteCorporate);

export default CorporateRouter;
