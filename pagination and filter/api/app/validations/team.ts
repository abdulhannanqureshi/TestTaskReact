import { body, ValidationChain } from 'express-validator';
import { FieldsMaxLengths, FieldsMinLengths, message } from '../common';

export const AddTeamValidation: ValidationChain[] = [
  body('firstName')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'First Name'))
    .trim()
    .isLength({ min: FieldsMinLengths.firstName })
    .withMessage(
      message.minLengthError
        .replace(':item', 'First Name')
        .replace(':length', FieldsMinLengths.firstName)
    ),
  body('lastName')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Last Name'))
    .trim()
    .isLength({ min: FieldsMinLengths.lastName })
    .withMessage(
      message.minLengthError
        .replace(':item', 'Last Name')
        .replace(':length', FieldsMinLengths.lastName)
    ),
  body('designation')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Designation')),
  body('aboutUs')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'About Us')),
];

export const EditTeamValidation: ValidationChain[] = [
  body('firstName')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'First Name'))
    .trim()
    .isLength({ min: FieldsMinLengths.firstName })
    .withMessage(
      message.minLengthError
        .replace(':item', 'First Name')
        .replace(':length', FieldsMinLengths.firstName)
    ),
  body('lastName')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Last Name'))
    .trim()
    .isLength({ min: FieldsMinLengths.lastName })
    .withMessage(
      message.minLengthError
        .replace(':item', 'Last Name')
        .replace(':length', FieldsMinLengths.lastName)
    ),
  body('designation')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Designation')),
  body('aboutUs')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'About Us')),
];
