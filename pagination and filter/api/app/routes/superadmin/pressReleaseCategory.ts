import express from 'express';
import {
  AddPressCategoryValidation,
  EditPressCategoryValidation,
} from '../../validations';
import {
  addPressReleaseCategory,
  getPressReleaseCategory,
  updatePressReleaseCategory,
  updatePressReleaseCategoryStatus,
  deletePressReleaseCategory,
  viewPressReleaseCategory,
} from '../../controllers/superadmin';
import { ValidateAdminToken } from '../../common';
const PressReleaseCategoryRouter: express.Router = express.Router();

PressReleaseCategoryRouter.post(
  '/',
  ValidateAdminToken,
  AddPressCategoryValidation,
  addPressReleaseCategory
);
PressReleaseCategoryRouter.get(
  '/',
  ValidateAdminToken,
  getPressReleaseCategory
);
PressReleaseCategoryRouter.put(
  '/:id',
  ValidateAdminToken,
  EditPressCategoryValidation,
  updatePressReleaseCategory
);

PressReleaseCategoryRouter.put(
  '/update-status/:id',
  ValidateAdminToken,
  updatePressReleaseCategoryStatus
);
PressReleaseCategoryRouter.delete(
  '/:id',
  ValidateAdminToken,
  deletePressReleaseCategory
);
PressReleaseCategoryRouter.get(
  '/:id',
  ValidateAdminToken,
  viewPressReleaseCategory
);

export default PressReleaseCategoryRouter;
