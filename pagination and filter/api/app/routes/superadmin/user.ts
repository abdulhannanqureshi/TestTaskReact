import express from 'express';
import { AddUserValidation, EditUserValidation } from '../../validations';
import {
  getUsers,
  addUser,
  updateUser,
  viewUser,
  updateStatus,
  deleteUser,
  getUniversities,
  getCorporate,
  userBulkAction,
  exportsUserCsv,
} from '../../controllers/superadmin';
import { ValidateAdminToken } from '../../common';
const UserRouter: express.Router = express.Router();

UserRouter.post('/', ValidateAdminToken, AddUserValidation, addUser);
UserRouter.post(
  '/bulk-action',
  ValidateAdminToken,
  userBulkAction
);
UserRouter.get('/', ValidateAdminToken, getUsers);
UserRouter.get('/universities', ValidateAdminToken, getUniversities);
UserRouter.get('/corporation', ValidateAdminToken, getCorporate);
// UserRouter.get('/user-csv',  exportsUserCsv);
 UserRouter.get('/user-csv', ValidateAdminToken, exportsUserCsv);
UserRouter.get('/:id', ValidateAdminToken, viewUser);
UserRouter.put('/:id', ValidateAdminToken, EditUserValidation, updateUser);
UserRouter.put('/update-status/:id', ValidateAdminToken, updateStatus);
UserRouter.delete('/:id', ValidateAdminToken, deleteUser);

export default UserRouter;
