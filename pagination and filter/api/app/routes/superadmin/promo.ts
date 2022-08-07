import express from 'express';

import {
  addPromo,
  listPromo,
  viewPromo,
  deletePromo,
  updatePromo,
  updatePromoStatus,
  promoBulkAction,
} from '../../controllers/superadmin';
import { AddPromoValidation, EditPromoValidation } from '../../validations';
import { ValidateAdminToken } from '../../common';
const PromoRouter: express.Router = express.Router();

PromoRouter.post('/', ValidateAdminToken, AddPromoValidation, addPromo);
PromoRouter.get('/', ValidateAdminToken, listPromo);
PromoRouter.get('/:id', ValidateAdminToken, viewPromo);
PromoRouter.delete('/:id', ValidateAdminToken, deletePromo);
PromoRouter.put('/bulk-action', ValidateAdminToken, promoBulkAction);
PromoRouter.put('/:id', ValidateAdminToken, EditPromoValidation, updatePromo);
PromoRouter.put('/update-status/:id', ValidateAdminToken, updatePromoStatus);

export default PromoRouter;
