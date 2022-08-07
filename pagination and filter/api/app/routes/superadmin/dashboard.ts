import express from 'express';
import { ValidateAdminToken } from '../../common';
import {
  getCoursesUserAndSalesCount,
  totalSales,
} from '../../controllers/superadmin';
const DashboardRouter: express.Router = express.Router();

DashboardRouter.get(
  '/courseAndUserCount',
  ValidateAdminToken,
  getCoursesUserAndSalesCount
);
DashboardRouter.get('/totalSales', ValidateAdminToken, totalSales);

export default DashboardRouter;
