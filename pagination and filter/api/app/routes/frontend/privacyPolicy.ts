import express from 'express';

import { getPrivacyPolicy } from '../../controllers/frontend';
const PrivacyPolicyRouter: express.Router = express.Router();

PrivacyPolicyRouter.get('/', getPrivacyPolicy);

export default PrivacyPolicyRouter;
