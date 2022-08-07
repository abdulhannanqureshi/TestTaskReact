import express from 'express';
import { AddAdminValidation, EditAdminValidation } from '../../validations';
import {
  addAdmin,
  getAdmins,
  viewAdmin,
  updateAdmin,
  updateAdminStatus,
  deleteAdmin,
  adminBulkAction,
  exportsAdminCsv,
} from '../../controllers/superadmin';
import { ValidateAdminToken } from '../../common';
const AdminRouter: express.Router = express.Router();

AdminRouter.post('/', ValidateAdminToken, AddAdminValidation, addAdmin);
AdminRouter.post('/bulk-action', ValidateAdminToken, adminBulkAction);
AdminRouter.get('/', ValidateAdminToken, getAdmins);
// AdminRouter.get('/Admin-csv',  exportsAdminCsv);
AdminRouter.get('/admin-csv', ValidateAdminToken, exportsAdminCsv);
AdminRouter.get('/:id', ValidateAdminToken, viewAdmin);
AdminRouter.put('/:id', ValidateAdminToken, EditAdminValidation, updateAdmin);
AdminRouter.put('/update-status/:id', ValidateAdminToken, updateAdminStatus);
AdminRouter.delete('/:id', ValidateAdminToken, deleteAdmin);

export default AdminRouter;
