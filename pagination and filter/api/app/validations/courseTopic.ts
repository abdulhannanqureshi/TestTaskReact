import { body, ValidationChain } from 'express-validator';
import { FieldsMaxLengths, FieldsMinLengths, message } from '../common';
/**
 *
 */
export const AddCourseTopicValidation: ValidationChain[] = [
  body('title')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Title'))
    .trim(),
  body('subTitle')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Sub Title'))
    .trim(),
  body('description')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Decscrion'))
    .trim(),
  body('topicName')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Topic name'))
    .trim(),
  body('bodySection1')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Whats Covered'))
    .trim(),
  body('bodySection2')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Team'))
    .trim(),
  body('bodySection3')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Team'))
    .trim(),
  body('bodySection4')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Team'))
    .trim(),
];

export const EditCourseTopicValidation: ValidationChain[] = [
  body('title')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Title'))
    .trim(),
  body('subTitle')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Sub Title'))
    .trim(),
  body('description')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Decscrion'))
    .trim(),
  body('topicName')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Topic name'))
    .trim(),
  body('bodySection1')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Whats Covered'))
    .trim(),
  body('bodySection2')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Team'))
    .trim(),
  body('bodySection3')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Team'))
    .trim(),
  body('bodySection4')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Team'))
    .trim(),
];
