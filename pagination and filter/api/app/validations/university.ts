import { body, ValidationChain } from 'express-validator';
import { FieldsMaxLengths, FieldsMinLengths, message } from '../common';
/**
 *
 */
export const AddUniversityValidation: ValidationChain[] = [
  body('name')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Name'))
    .trim(),
];

export const EditUniversityValidation: ValidationChain[] = [
  body('name')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Name'))
    .trim(),
];
