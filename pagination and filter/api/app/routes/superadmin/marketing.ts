import express from 'express';
import {
  updateMarket,
  viewMarket,
  getMarket,
} from './../../controllers/superadmin';
import { ValidateAdminToken, upload } from '../../common';
import { EmailTemplateValidation } from '../../validations';

const MarketRouter: express.Router = express.Router();

MarketRouter.get('/', ValidateAdminToken, getMarket);
MarketRouter.get('/:id', ValidateAdminToken, viewMarket);
MarketRouter.put(
  '/:id',
  ValidateAdminToken,
  upload.fields([
    { name: 'marketBannerImage', maxCount: 1 },
    { name: 'blockImage1', maxCount: 1 },
    { name: 'blockImage2', maxCount: 1 },
    { name: 'blockImage3', maxCount: 1 },
    { name: 'blockImage4', maxCount: 1 },
    { name: 'blockImage5', maxCount: 1 },
    { name: 'blockImage6', maxCount: 1 },
    { name: 'blockImage7', maxCount: 1 },
    { name: 'blockImage8', maxCount: 1 },
    { name: 'blockImage9', maxCount: 1 },
    { name: 'blockImage10', maxCount: 1 },
  ]),
  updateMarket
);

export default MarketRouter;
