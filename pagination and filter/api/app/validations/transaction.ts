import { body, ValidationChain } from "express-validator";
import { FieldsMaxLengths,FieldsMinLengths,message } from "../common";
/**
 *
 */
export const AddTransactionValidation: ValidationChain[] = [  
  body("cardNumber").not().isEmpty().withMessage(message.required.replace(':item','Card Number')).trim(),
  body("cardExpMonth").not().isEmpty().withMessage(message.required.replace(':item','Card Expire Month')).trim(),
  body("cardExpYear").not().isEmpty().withMessage(message.required.replace(':item','Card Expire Year')).trim(),
  body("cardCvc").not().isEmpty().withMessage(message.required.replace(':item','Card CVC')).trim(),
  body("cardExpYear").not().isEmpty().withMessage(message.required.replace(':item','Card Expire Year')).trim(),
  body("cardName").not().isEmpty().withMessage(message.required.replace(':item','Card Name')).trim(),
  body("moduleId").not().isEmpty().withMessage(message.required.replace(':item','Module Id')).trim(),

];
