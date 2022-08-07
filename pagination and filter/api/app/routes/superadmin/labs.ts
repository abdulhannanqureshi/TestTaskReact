import express from 'express';
import {
  addLab,
  getLabs,
  viewLab,
  updateLab,
  updateLabStatus,
  deleteLab,
  labBulkAction,
} from './../../controllers/superadmin';
import { ValidateAdminToken, upload } from '../../common';
import { AddLabValidation, EditLabValidation } from '../../validations';

const LabRouter: express.Router = express.Router();

LabRouter.get('/', getLabs);
LabRouter.get('/:id', viewLab);

LabRouter.post(
  '/',
  ValidateAdminToken,
  // AddLabValidation,
  upload.single('labsImage'),
  addLab
);
LabRouter.put('/bulk-action', ValidateAdminToken, labBulkAction);
LabRouter.put(
  '/:id',
  ValidateAdminToken,

  upload.single('labsImage'),
  updateLab
);
LabRouter.put(
  '/update-status/:id',
  ValidateAdminToken,
  EditLabValidation,
  updateLabStatus
);

LabRouter.delete('/:id', ValidateAdminToken, deleteLab);
export default LabRouter;
