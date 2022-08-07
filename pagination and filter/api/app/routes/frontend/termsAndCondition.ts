import express from 'express';

import { getTermsAndCondition } from '../../controllers/frontend';
const TermsAndConditionRouter: express.Router = express.Router();

TermsAndConditionRouter.get('/', getTermsAndCondition);

export default TermsAndConditionRouter;
