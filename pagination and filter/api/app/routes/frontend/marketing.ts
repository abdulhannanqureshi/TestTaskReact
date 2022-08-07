import express from 'express';
import { viewMarket, getMarket } from './../../controllers/frontend';

const MarketRouter: express.Router = express.Router();

MarketRouter.get('/', getMarket);
MarketRouter.get('/:id', viewMarket);

export default MarketRouter;
