import { body, ValidationChain } from 'express-validator';
import { FieldsMaxLengths, FieldsMinLengths, message } from '../common';
/**
 *
 */
export const AddEnterpriseValidation: ValidationChain[] = [
  body('firstName')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'First Name'))
    .trim()
    .isLength({ min: FieldsMinLengths.firstName })
    .withMessage(
      message.minLengthError
        .replace(':item', 'Last Name')
        .replace(':length', FieldsMinLengths.firstName)
    ),
  body('email')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Email'))
    .trim()
    .isEmail()
    .withMessage(message.invalidEmail),
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
  // body("mobileNumber").not().isEmpty().withMessage(message.required.replace(':item','Mobile Number')).trim(),
  body('contactNumber')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Contact Number'))
    .trim(),
  body('message')
    .not()
    .isEmpty()
    .withMessage(message.required.replace(':item', 'Message'))
    .trim(),
];
