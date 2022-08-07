/** @format */
import express from 'express';
import AuthRouter from './Auth';
import BookRouter from './Book';

const router = express.Router();

router.use('/auth', AuthRouter);
router.use('/book', BookRouter);

export default router;
