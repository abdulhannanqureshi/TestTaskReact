import { body, ValidationChain } from 'express-validator';
import { FieldsMaxLengths, FieldsMinLengths, message } from '../common';
/**
 *
 */
export const AddLabValidation: ValidationChain[] = [
  body('category')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Category'))
    .trim(),
  body('title')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Title'))
    .trim(),
  body('description')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Description'))
    .trim(),
  body('link')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Link'))
    .trim(),
];

export const EditLabValidation: ValidationChain[] = [
  body('category')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Category'))
    .trim(),
  body('title')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Title'))
    .trim(),
  body('description')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Description'))
    .trim(),
  body('link')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Link'))
    .trim(),
];
