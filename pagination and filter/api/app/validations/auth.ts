import { body, ValidationChain } from "express-validator";
import { FieldsMaxLengths,FieldsMinLengths,message } from "../common";
/**
 *
 */
 
export const LoginValidation: ValidationChain[] = [
  body("email").not().isEmpty().withMessage(message.required.replace(':item','Email')).trim().isEmail().withMessage(message.invalidEmail),
  body("password").not().isEmpty().withMessage(message.required.replace(':item','Password')).trim().isLength({ min: FieldsMinLengths.password }).withMessage(message.minLengthError.replace(':item','Password').replace(':length',FieldsMinLengths.password))
];

export const SignupValidation: ValidationChain[] = [
  body("firstName").not().isEmpty().withMessage(message.required.replace(':item','First Name')).trim().isLength({ min: FieldsMinLengths.firstName }).withMessage(message.minLengthError.replace(':item','First Name').replace(':length',FieldsMinLengths.firstName)),
  body("lastName").not().isEmpty().withMessage(message.required.replace(':item','Last Name')).trim().isLength({ min: FieldsMinLengths.lastName }).withMessage(message.minLengthError.replace(':item','Last Name').replace(':length',FieldsMinLengths.lastName)),
  body("email").not().isEmpty().withMessage(message.required.replace(':item','Email')).trim().isEmail().withMessage(message.invalidEmail),
  body("password").not().isEmpty().withMessage(message.required.replace(':item','Password')).trim().isLength({ min: FieldsMinLengths.password }).withMessage(message.minLengthError.replace(':item','Password').replace(':length',FieldsMinLengths.password))
];

export const ProfileValidation: ValidationChain[] = [
  body("firstName").not().isEmpty().withMessage(message.required.replace(':item','First Name')).trim().isLength({ min: FieldsMinLengths.firstName }).withMessage(message.minLengthError.replace(':item','First Name').replace(':length',FieldsMinLengths.firstName)),
  body("lastName").not().isEmpty().withMessage(message.required.replace(':item','Last Name')).trim().isLength({ min: FieldsMinLengths.lastName }).withMessage(message.minLengthError.replace(':item','Last Name').replace(':length',FieldsMinLengths.lastName)),
  body("email").not().isEmpty().withMessage(message.required.replace(':item','Email')).trim().isEmail().withMessage(message.invalidEmail),
];

export const AdminProfileValidation: ValidationChain[] = [
  body("firstName").not().isEmpty().withMessage(message.required.replace(':item','First Name')).trim().isLength({ min: FieldsMinLengths.firstName }).withMessage(message.minLengthError.replace(':item','First Name').replace(':length',FieldsMinLengths.firstName)),
  // body("lastName").not().isEmpty().withMessage(message.required.replace(':item','Last Name')).trim().isLength({ min: FieldsMinLengths.lastName }).withMessage(message.minLengthError.replace(':item','Last Name').replace(':length',FieldsMinLengths.lastName)),
  body("email").not().isEmpty().withMessage(message.required.replace(':item','Email')).trim().isEmail().withMessage(message.invalidEmail),
];

export const ChangePasswordValidation: ValidationChain[] = [
  body("oldPassword").not().isEmpty().withMessage(message.required.replace(':item','Old Password')).trim().isLength({ min: FieldsMinLengths.password }).withMessage(message.minLengthError.replace(':item','Password').replace(':length',FieldsMinLengths.password)),
  body("newPassword").not().isEmpty().withMessage(message.required.replace(':item','New Password')).trim().isLength({ min: FieldsMinLengths.password }).withMessage(message.minLengthError.replace(':item','Password').replace(':length',FieldsMinLengths.password))
];

export const ForgotPassValidation: ValidationChain[] = [
  body("email").not().isEmpty().withMessage(message.required.replace(':item','Email')).trim().isEmail().withMessage(message.invalidEmail),
];


export const ResetPasswordValidation: ValidationChain[] = [
  body("password").not().isEmpty().withMessage(message.required.replace(':item','Password')).trim().isLength({ min: FieldsMinLengths.password }).withMessage(message.minLengthError.replace(':item','Password').replace(':length',FieldsMinLengths.password)),
];

export const AddUserValidation: ValidationChain[] = [  
  body("firstName").not().isEmpty().withMessage(message.required.replace(':item','First Name')).trim().isLength({ min: FieldsMinLengths.firstName }).withMessage(message.minLengthError.replace(':item','First Name').replace(':length',FieldsMinLengths.firstName)),
  body("lastName").not().isEmpty().withMessage(message.required.replace(':item','Last Name')).trim().isLength({ min: FieldsMinLengths.lastName }).withMessage(message.minLengthError.replace(':item','Last Name').replace(':length',FieldsMinLengths.lastName)),
  body("email").not().isEmpty().withMessage(message.required.replace(':item','Email')).trim().isEmail().withMessage(message.invalidEmail),
  body("password").not().isEmpty().withMessage(message.required.replace(':item','Password')).trim().isLength({ min: FieldsMinLengths.password }).withMessage(message.minLengthError.replace(':item','Password').replace(':length',FieldsMinLengths.password))
];

export const EditUserValidation: ValidationChain[] = [  
  body("firstName").not().isEmpty().withMessage(message.required.replace(':item','First Name')).trim().isLength({ min: FieldsMinLengths.firstName }).withMessage(message.minLengthError.replace(':item','First Name').replace(':length',FieldsMinLengths.firstName)),
  body("lastName").not().isEmpty().withMessage(message.required.replace(':item','Last Name')).trim().isLength({ min: FieldsMinLengths.lastName }).withMessage(message.minLengthError.replace(':item','Last Name').replace(':length',FieldsMinLengths.lastName)),
  body("email").not().isEmpty().withMessage(message.required.replace(':item','Email')).trim().isEmail().withMessage(message.invalidEmail),
];