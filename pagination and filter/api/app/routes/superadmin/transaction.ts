import express from 'express';
import {
  getTransactionList,
  viewTransaction,
  exportsTransactionCsv,
} from '../../controllers/superadmin';
import { ValidateAdminToken } from '../../common';
const TransactionRouter: express.Router = express.Router();

TransactionRouter.get('/', ValidateAdminToken, getTransactionList);
TransactionRouter.get(
  '/transaction-csv',
  ValidateAdminToken,
  exportsTransactionCsv
);
TransactionRouter.get('/:id', ValidateAdminToken, viewTransaction);

export default TransactionRouter;
