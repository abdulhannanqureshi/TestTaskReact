import express from 'express';
import { EditSettingValidation } from '../../validations';
import {
  updateSetting,
  viewSetting,
} from '../../controllers/superadmin';
import { ValidateAdminToken } from '../../common';
const SettingRouter: express.Router = express.Router();

SettingRouter.get('/', ValidateAdminToken, viewSetting);
SettingRouter.put('/', ValidateAdminToken, EditSettingValidation, updateSetting);

export default SettingRouter;
