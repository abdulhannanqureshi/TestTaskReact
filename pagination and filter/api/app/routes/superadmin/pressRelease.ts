import express from 'express';
import {
  AddPressReleaseValidation,
  EditPressReleaseValidation,
} from '../../validations';
import {
  addPressRelease,
  getPressRelease,
  viewPressRelease,
  updatePressRelease,
  updatePressReleaseStatus,
  deletePressRelease,
  pressBulkAction,
} from '../../controllers/superadmin';
import { ValidateAdminToken, upload } from '../../common';
const PressReleaseRouter: express.Router = express.Router();
PressReleaseRouter.get('/', ValidateAdminToken, getPressRelease);
PressReleaseRouter.post(
  '/',
  ValidateAdminToken,
  upload.single('pressFeatureImage'),
  AddPressReleaseValidation,
  addPressRelease
);
PressReleaseRouter.get('/', ValidateAdminToken, getPressRelease);
PressReleaseRouter.put('/bulk-action', ValidateAdminToken, pressBulkAction);
PressReleaseRouter.put(
  '/:id',
  ValidateAdminToken,
  upload.single('pressFeatureImage'),
  EditPressReleaseValidation,
  updatePressRelease
);

PressReleaseRouter.put(
  '/update-status/:id',
  ValidateAdminToken,
  updatePressReleaseStatus
);
PressReleaseRouter.delete('/:id', ValidateAdminToken, deletePressRelease);
PressReleaseRouter.get('/:id', ValidateAdminToken, viewPressRelease);

export default PressReleaseRouter;
