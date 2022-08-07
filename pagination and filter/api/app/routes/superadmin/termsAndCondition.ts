import express from 'express';
import { EditTermsAndCondition } from '../../validations';
import {
  viewTermsAndCondition,
  updateTermsAndCondition,
} from '../../controllers/superadmin';
import { ValidateAdminToken } from '../../common';
const TermsAndConditionRouter: express.Router = express.Router();

TermsAndConditionRouter.get('/', ValidateAdminToken, viewTermsAndCondition);
TermsAndConditionRouter.put(
  '/',
  ValidateAdminToken,
  EditTermsAndCondition,
  updateTermsAndCondition
);

export default TermsAndConditionRouter;
