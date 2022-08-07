/** @format */

import express from "express";
import { AuthController } from "../../../controllers/api/v1";
import { validatePostBody } from '../../../util';
const { Auth } = require('../../../validators');

const router = express.Router();

router.post("/google-login", validatePostBody(Auth.googleLogin), AuthController.googleLogin);



export default router;