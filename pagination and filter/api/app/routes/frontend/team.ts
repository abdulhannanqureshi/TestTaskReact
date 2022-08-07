import express from 'express';

import { getTeam, viewTeam } from '../../controllers/frontend';
import { ValidateAdminToken, upload } from '../../common';
const TeamRouter: express.Router = express.Router();

TeamRouter.get('/', getTeam);
TeamRouter.get('/:id', viewTeam);

export default TeamRouter;
