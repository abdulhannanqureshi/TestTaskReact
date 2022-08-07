import express from 'express';
import { AddModuleValidation, EditModuleValidation } from '../../validations';
import {
  getModules,
  addModule,
  updateModule,
  viewModule,
  updateModuleStatus,
  deleteModule,
  moduleBulkAction,
} from '../../controllers/superadmin';
import { ValidateAdminToken } from '../../common';
const ModuleRouter: express.Router = express.Router();

ModuleRouter.post('/', addModule);
ModuleRouter.get('/', ValidateAdminToken, getModules);
ModuleRouter.get('/:id', ValidateAdminToken, viewModule);
ModuleRouter.put('/bulk-action', ValidateAdminToken, moduleBulkAction);
ModuleRouter.put(
  '/:id',
  ValidateAdminToken,
  EditModuleValidation,
  updateModule
);
ModuleRouter.put('/update-status/:id', ValidateAdminToken, updateModuleStatus);
ModuleRouter.delete('/:id', ValidateAdminToken, deleteModule);

export default ModuleRouter;
