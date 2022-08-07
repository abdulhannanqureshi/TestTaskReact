import express from 'express';

import { getRefundPolicy } from '../../controllers/frontend';
const RefundPolicyRouter: express.Router = express.Router();

RefundPolicyRouter.get('/', getRefundPolicy);

export default RefundPolicyRouter;
