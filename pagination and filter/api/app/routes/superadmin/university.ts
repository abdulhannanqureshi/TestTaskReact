import express from 'express';
import {
  AddUniversityValidation,
  EditUniversityValidation,
} from '../../validations';
import {
  addUniversity,
  updateUniversity,
  getUniversityList,
  viewUniversity,
  deleteUniversity,
  updateStatusUniversity,
} from '../../controllers/superadmin';
import { ValidateAdminToken } from '../../common';
const UniversityRouter: express.Router = express.Router();

UniversityRouter.post(
  '/',
  AddUniversityValidation,
  addUniversity
);
UniversityRouter.get('/', ValidateAdminToken, getUniversityList);
UniversityRouter.get('/:id', ValidateAdminToken,viewUniversity);
UniversityRouter.put(
  '/:id',
  EditUniversityValidation,
  ValidateAdminToken,
  updateUniversity
);
UniversityRouter.put(
  '/update-status/:id',
  ValidateAdminToken,
  updateStatusUniversity
);
UniversityRouter.delete('/:id', ValidateAdminToken, deleteUniversity);

export default UniversityRouter;
