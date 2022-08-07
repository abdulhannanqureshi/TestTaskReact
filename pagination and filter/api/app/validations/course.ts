import { body, ValidationChain } from 'express-validator';
import { message } from '../common';
/**
 *
 */
export const AddCourseValidation: ValidationChain[] = [
  body('title')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Title'))
    .trim(),
  body('price')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Amount'))
    .trim(),
  body('topic')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Category'))
    .trim(),
];

export const EditCourseValidation: ValidationChain[] = [
  body('title')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Title'))
    .trim(),
  body('price')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Amount'))
    .trim(),
  body('topic')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Category'))
    .trim(),
];
