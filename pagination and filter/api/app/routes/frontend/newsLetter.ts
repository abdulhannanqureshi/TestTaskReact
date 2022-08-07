import express from 'express';
import { addNewsLetter } from '../../controllers/frontend';
import { ValidateUserToken } from '../../common';
const NewsLetterRouter: express.Router = express.Router();

NewsLetterRouter.post('/', addNewsLetter);

export default NewsLetterRouter;
