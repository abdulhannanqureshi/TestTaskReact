import express from 'express';
import { EditRefundPolicyValidation } from '../../validations';
import {
  updateRefundPolicy,
  viewRefundPolicy,
} from '../../controllers/superadmin';
import { ValidateAdminToken } from '../../common';
const RefundPolicyRouter: express.Router = express.Router();

RefundPolicyRouter.get('/', ValidateAdminToken, viewRefundPolicy);
RefundPolicyRouter.put(
  '/',
  ValidateAdminToken,
  EditRefundPolicyValidation,
  updateRefundPolicy
);

export default RefundPolicyRouter;
