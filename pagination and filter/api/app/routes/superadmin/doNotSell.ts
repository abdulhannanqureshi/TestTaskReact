import express from 'express';
import { EditDoNotSellValidation } from '../../validations';
import { updateDoNotSell, viewDoNotSell } from '../../controllers/superadmin';
import { ValidateAdminToken } from '../../common';
const DoNotSellRouter: express.Router = express.Router();

DoNotSellRouter.get('/', ValidateAdminToken, viewDoNotSell);
DoNotSellRouter.put(
  '/',
  ValidateAdminToken,
  EditDoNotSellValidation,
  updateDoNotSell
);

export default DoNotSellRouter;
