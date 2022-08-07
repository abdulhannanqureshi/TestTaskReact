import { body, ValidationChain } from 'express-validator';
import { FieldsMaxLengths, FieldsMinLengths, message } from '../common';

export const AddAdminValidation: ValidationChain[] = [
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
  body('roleName')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Role Name')),

  body('email')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Email'))
    .trim()
    .isEmail()
    .withMessage(message.invalidEmail),
  body('rolesPermission')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Permission')),
  body('password')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Password'))
    .trim()
    .isLength({ min: FieldsMinLengths.password })
    .withMessage(
      message.minLengthError
        .replace(':item', 'Password')
        .replace(':length', FieldsMinLengths.password)
    ),
];

export const EditAdminValidation: ValidationChain[] = [
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
  body('email')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Email'))
    .trim()
    .isEmail()
    .withMessage(message.invalidEmail),
];
