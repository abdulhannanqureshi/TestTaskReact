import express from 'express';

import { getSetting } from '../../controllers/frontend';
const SettingRouter: express.Router = express.Router();

SettingRouter.get('/', getSetting);

export default SettingRouter;
