import { body, ValidationChain } from 'express-validator';
import { FieldsMaxLengths, FieldsMinLengths, message } from '../common';
/**
 *
 */
export const AddCorporateValidation: ValidationChain[] = [
  body('name')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Name'))
    .trim(),
];

export const EditCorporateValidation: ValidationChain[] = [
  body('name')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Name'))
    .trim(),
];
