import express from 'express';

import { gettlmsCategories, gettlmsCourses } from '../../controllers/frontend';
const TalentRouter: express.Router = express.Router();

TalentRouter.get('/category', gettlmsCategories);
TalentRouter.get('/courses', gettlmsCourses);

export default TalentRouter;
