import express from 'express';

import { getPressRelease, viewPressRelease } from '../../controllers/frontend';
const PressReleaseRouter: express.Router = express.Router();

PressReleaseRouter.get('/', getPressRelease);
PressReleaseRouter.get('/:id', viewPressRelease);

export default PressReleaseRouter;
