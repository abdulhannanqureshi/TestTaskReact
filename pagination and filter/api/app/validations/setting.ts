import { body, ValidationChain } from "express-validator";
import { FieldsMaxLengths,FieldsMinLengths,message } from "../common";


export const EditSettingValidation: ValidationChain[] = [  
  body("courseDuration").not().isEmpty().withMessage(message.required.replace(':item','Course duration')).trim(),
  body("facebook").not().isEmpty().withMessage(message.required.replace(':item','Facebook')).trim(),
  body("twitter").not().isEmpty().withMessage(message.required.replace(':item','Twitter')).trim(),
  body("linkedin").not().isEmpty().withMessage(message.required.replace(':item','Linkedin')).trim(),
  body("pinterest").not().isEmpty().withMessage(message.required.replace(':item','Pinterest')).trim(),
  body("phone").not().isEmpty().withMessage(message.required.replace(':item','Phone')).trim(),
  body("email").not().isEmpty().withMessage(message.required.replace(':item','Email')).trim(),
  body("headOfficeAddress").not().isEmpty().withMessage(message.required.replace(':item','Head office address')).trim(),
];