import express from 'express';

import {
  applyPromo,
  checkout,
  checkoutWithCardSave,
  getTransactionList,
} from '../../controllers/frontend';
import { ValidateUserToken } from '../../common';
import { AddTransactionValidation } from '../../validations';
const TransactionRouter: express.Router = express.Router();

TransactionRouter.post('/applyPromo', ValidateUserToken, applyPromo);
TransactionRouter.post('/', ValidateUserToken, checkout);
TransactionRouter.get('/', ValidateUserToken, getTransactionList);
TransactionRouter.post('/checkoutWithCardSave', checkoutWithCardSave);

// TransactionRouter.get("/",getCardListOfUser );

export default TransactionRouter;
