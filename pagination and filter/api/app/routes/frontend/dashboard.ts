import express from 'express';
import { ValidateUserToken } from '../../common';
import { getCoursesUserAndSalesCount } from '../../controllers/frontend';
const DashboardRouter: express.Router = express.Router();

DashboardRouter.get(
  '/courseAndPurchaseCount',
  ValidateUserToken,
  getCoursesUserAndSalesCount
);

export default DashboardRouter;
