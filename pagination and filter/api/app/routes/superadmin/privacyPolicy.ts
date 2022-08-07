import express from 'express';
import { EditPrivacyPolicyValidation } from '../../validations';
import {
  updatePrivacyPolicy,
  viewPrivacyPolicy,
} from '../../controllers/superadmin';
import { ValidateAdminToken } from '../../common';
const PrivacyPolicyRouter: express.Router = express.Router();

PrivacyPolicyRouter.get('/', ValidateAdminToken, viewPrivacyPolicy);
PrivacyPolicyRouter.put(
  '/',
  ValidateAdminToken,
  EditPrivacyPolicyValidation,
  updatePrivacyPolicy
);

export default PrivacyPolicyRouter;
