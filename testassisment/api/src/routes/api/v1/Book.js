/** @format */

import express from "express";
import { BookController } from "../../../controllers/api/v1";
import { verifyToken } from "../../../util/User";
import { validateQueryParams } from '../../../util';
const { Book } = require('../../../validators');

const router = express.Router();

router.get("/", verifyToken, validateQueryParams(Book.searchBook), BookController.list);



export default router;