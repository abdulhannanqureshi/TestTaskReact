import express from 'express';

import { getDoNotSell } from '../../controllers/frontend';
const DoNotSellRouter: express.Router = express.Router();

DoNotSellRouter.get('/', getDoNotSell);

export default DoNotSellRouter;
