/** @format */

import express from 'express';
import ApiRoutes from './api/v1';

const router = express.Router();

router.use('/api/v1', ApiRoutes);

export default router;
