import { body, ValidationChain } from "express-validator";
import { message } from "../common";
/**
 *
 */
export const AddModuleValidation: ValidationChain[] = [  
  body("moduleName").not().isEmpty().withMessage(message.required.replace(':item','Module Name')).trim(),
  body("course").not().isEmpty().withMessage(message.required.replace(':item','Course')).trim(),
  body("amount").not().isEmpty().withMessage(message.required.replace(':item','Amount')).trim(),
];

export const EditModuleValidation: ValidationChain[] = [  
  body("moduleName").not().isEmpty().withMessage(message.required.replace(':item','Module Name')).trim(),
  body("course").not().isEmpty().withMessage(message.required.replace(':item','Course')).trim(),
  body("amount").not().isEmpty().withMessage(message.required.replace(':item','Amount')).trim(),
];