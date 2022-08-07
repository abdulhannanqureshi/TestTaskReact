import express from 'express';
import { getCms, viewCms } from './../../controllers/frontend';

const CmsRouter: express.Router = express.Router();

CmsRouter.get('/', getCms);
CmsRouter.get('/:id', viewCms);

export default CmsRouter;
