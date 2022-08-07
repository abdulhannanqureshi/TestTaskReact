import express from 'express';
import { AddTeamValidation, EditTeamValidation } from '../../validations';
import {
  addTeamMember,
  getTeam,
  viewTeam,
  updateTeam,
  updateTeamStatus,
  deleteTeamMember,
  teamBulkAction,
  updateTeamByOrder,
} from '../../controllers/superadmin';
import { ValidateAdminToken, upload } from '../../common';
const TeamRouter: express.Router = express.Router();

TeamRouter.post(
  '/',
  ValidateAdminToken,
  upload.single('teamMemberImage'),
  AddTeamValidation,
  addTeamMember
);
TeamRouter.post('/bulk-action', ValidateAdminToken, teamBulkAction);
TeamRouter.get('/', ValidateAdminToken, getTeam);

TeamRouter.get('/:id', ValidateAdminToken, viewTeam);
TeamRouter.put('/update-order', ValidateAdminToken, updateTeamByOrder);
TeamRouter.put(
  '/:id',
  ValidateAdminToken,
  upload.single('teamMemberImage'),
  EditTeamValidation,
  updateTeam
);
TeamRouter.put('/update-status/:id', ValidateAdminToken, updateTeamStatus);
TeamRouter.delete('/:id', ValidateAdminToken, deleteTeamMember);

export default TeamRouter;
