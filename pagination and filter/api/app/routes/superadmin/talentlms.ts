import express from 'express';
import {
  addTlmsUsers,
  addTlmsCategories,
  // addTlmsCategoriesApi,
  addTlmsCourses,
} from '../../controllers/superadmin';
import { ValidateAdminToken } from '../../common';
const TalentRouter: express.Router = express.Router();

TalentRouter.get('/add-users', ValidateAdminToken, addTlmsUsers);
// TalentRouter.get('/add-category', ValidateAdminToken, addTlmsCategoriesApi);
TalentRouter.get('/add-course', addTlmsCourses);

export default TalentRouter;
