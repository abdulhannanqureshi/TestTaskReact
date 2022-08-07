import express from "express";
import {
    AddEnterpriseValidation,
  } from '../../validations';
import { addEnterprise } from "../../controllers/frontend";
const EnterpriseRouter: express.Router = express.Router();

EnterpriseRouter.post("/", AddEnterpriseValidation, addEnterprise);

export default EnterpriseRouter;
