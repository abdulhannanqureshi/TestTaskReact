import { body, ValidationChain } from 'express-validator';
import { FieldsMaxLengths, FieldsMinLengths, message } from '../common';

export const EditPrivacyPolicyValidation: ValidationChain[] = [
  body('title')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Title'))
    .trim(),
  body('content')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Content'))
    .trim(),
];
