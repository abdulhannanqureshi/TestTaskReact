import express from 'express';
import { AddModuleValidation, EditModuleValidation } from '../../validations';
import { getModules } from '../../controllers/frontend';
import { ValidateUserToken } from '../../common';
const ModuleRouter: express.Router = express.Router();

ModuleRouter.get('/', getModules);

export default ModuleRouter;
