import express from 'express';
import { AddUserValidation, EditUserValidation } from '../../validations';
import { userReport, salesReport } from '../../controllers/superadmin';
import { ValidateAdminToken } from '../../common';
const ReportRouter: express.Router = express.Router();

ReportRouter.get('/user', ValidateAdminToken, userReport);
ReportRouter.get('/sales', ValidateAdminToken, salesReport);

export default ReportRouter;
